import { encryptMessage, decryptMessage } from "../../utils/crypto";
import { supabaseClient } from "../../utils/supabase";

// SUSCRIPCION PARA PODER OBTENER LOS MENSAJES CADA VEZ QUE SE INSERTE EN LA TABLA
export function subscribeToMessages(queryClient) {
    const channel = supabaseClient
        // SUSCRIPCION PARA NUEVOS MENSAJES
        .channel('messages')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'tbl_messages',
            },
            async (payload) => {
                const current = queryClient.getQueryData(['messages']) ?? [];
                if (current.some(m => m.id === payload.new.id)) return;

                const decryptedContent = await decryptMessage(payload.new.content);
                const decryptedPreview = payload.new.reply_preview
                    ? await decryptMessage(payload.new.reply_preview)
                    : null;

                queryClient.setQueryData(
                    ['messages'],
                    (oldMessages = []) => [
                        ...oldMessages,
                        {
                            ...payload.new,
                            content: decryptedContent,
                            reply_preview: decryptedPreview,
                        }
                    ]
                );
            }
        )
        // SUSCRIPCION PARA PODER ACTUALIZAR EL ESTADO DE LEIDO (read_at) CUANDO EL RECEPTOR MARQUE EL MENSAJE COMO LEIDO
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'tbl_messages',
        }, (payload) => {

            queryClient.setQueryData(['messages'], (old = []) =>
                old.map(m => {
                    if (m.id !== payload.new.id) return m;
                    return {
                        ...m,
                        read_at: payload.new.read_at,
                        destacated: payload.new.destacated,
                        active: payload.new.active,
                    };

                })
            );
        })
        .subscribe();

    return () => {
        supabaseClient.removeChannel(channel);
    };
}

export async function fetchMessages() {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

    if (userError) {
        throw userError;
    }

    const { data, error } = await supabaseClient
        .from('tbl_messages')
        .select(`*, replied_message:reply_to_id (
            id,
            sender_id,
            content,
            reply_preview)
        `)
        .eq('active', true)
        .order('created_at', { ascending: true });

    if (error) {
        throw error;
    }

    return Promise.all(data.map(async (message) => ({
        ...message,
        content: await decryptMessage(message.content),
        // DESCIFRA EL SNAPSHOT DE LA RESPUESTA SI EXISTE
        reply_preview: message.reply_preview
            ? await decryptMessage(message.reply_preview)
            : null,
    })));
}

export async function sendMessage({ content, replyToId = null, replyPreview = null }) {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

    if (!content?.trim()) throw new Error("Mensaje vacío");

    const encryptedContent = await encryptMessage(content);

    const encryptedPreview = replyPreview
        ? await encryptMessage(replyPreview)
        : null;

    if (userError) throw userError;

    // Obtener el ID del otro usuario para asignarlo como receptor del mensaje
    const { data: otherUser, error: profileError } = await supabaseClient
        .from('tbl_profiles')
        .select('id')
        .neq('id', user.id)  // neq = not equal
        .single();

    if (profileError) throw profileError;

    // Insertar el mensaje en la tabla 'tbl_messages' con sender_id, receiver_id y content
    const { data, error } = await supabaseClient
        .from('tbl_messages')
        .insert({
            sender_id: user.id,
            receiver_id: otherUser.id,
            content: encryptedContent,
            reply_to_id: replyToId,
            reply_preview: encryptedPreview,
        });

    if (error) throw error;
    return data;
}

export async function markMessagesAsRead(messageIds) {
    if (!messageIds.length) return;

    const { error } = await supabaseClient
        .from('tbl_messages')
        .update({ read_at: new Date().toISOString() })
        .in('id', messageIds)
        .is('read_at', null);

    if (error) throw error;
}

export async function deleteMessage(messageId) {
    if (!messageId) return;

    const { error } = await supabaseClient
        .from('tbl_messages')
        .update({ active: false })
        .eq('id', messageId)
        .eq('active', true);

    if (error) throw error;

    const { updError } = await supabaseClient
        .from('tbl_starred_messages')
        .update({ active: false })
        .eq('message_id', messageId)
        .eq('active', true);

    if (updError) throw updError;
}

export async function setStarredMessage(messageId) {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

    if (userError) throw userError;
    if (!messageId) return;

    // BUSCA SI YA EXISTE EL MENSAJE
    const { data: existing } = await supabaseClient
        .from('tbl_starred_messages')
        .select('id, active')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .single();

    if (existing) {
        // SI YA EXISTE, ACTUALIZA EL ESTADO DE ACTIVE (TOGGLE)
        const { data, error } = await supabaseClient
            .from('tbl_starred_messages')
            .update({ active: !existing.active })
            .eq('id', existing.id);

        if (error) throw error;
    } else {
        // SI NO EXISTE, INSERTA UN NUEVO REGISTRO
        const { data, error } = await supabaseClient
            .from('tbl_starred_messages')
            .insert({ message_id: messageId, user_id: user.id });

        if (error) throw error;
    }

    const { error } = await supabaseClient
        .from('tbl_messages')
        .update({ destacated: true, starred_by: user.id })
        .eq('id', messageId)
        .eq('active', true);

    if (error) throw error;
}

export async function unStarredMessage(messageId) {
    if (!messageId) return;
    const { error } = await supabaseClient
        .from('tbl_messages')
        .update({ destacated: false })
        .eq('id', messageId)
        .eq('active', true);

    if (error) throw error;

    const { updError } = await supabaseClient
        .from('tbl_starred_messages')
        .update({ active: false })
        .eq('message_id', messageId)
        .eq('active', true);

    if (updError) throw updError;
}

export async function fetchStarredMessages() {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

    if (userError) throw userError;

    const { data, error } = await supabaseClient
        .from('tbl_starred_messages')
        .select(`
            id,
            active,
            created_at,
            tbl_messages (
                id,
                content,
                sender_id,
                starred_by,                
                reply_to_id,
                reply_preview,
                replied_message:reply_to_id (
                    id,
                    sender_id
                )
            )
        `)
        .eq('active', true)
        .eq('user_id', user.id)
        .order('tbl_messages (created_at)', { ascending: false });

    const messages = data.map(item => item.tbl_messages);

    console.log(messages);

    if (error) throw error;

    return Promise.all(messages.map(async (message) => ({
        ...message,
        content: await decryptMessage(message.content),
        // DESCIFRA EL SNAPSHOT DE LA RESPUESTA SI EXISTE
        reply_preview: message.reply_preview
            ? await decryptMessage(message.reply_preview)
            : null,
    })));
}