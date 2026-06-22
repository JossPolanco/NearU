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
            // Solo nos importa cuando cambia read_at (el receiver marcó como leído)
            if (!payload.new.read_at) return;

            queryClient.setQueryData(['messages'], (old = []) =>
                old.map(m =>
                    m.id === payload.new.id
                        ? { ...m, read_at: payload.new.read_at }
                        : m
                )
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