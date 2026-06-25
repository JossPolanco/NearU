import { encryptMessage, decryptMessage } from "../../utils/crypto";
import { supabaseClient } from "../../utils/supabase";

/**
 *  SERVICIO PARA MANEJAR LOS MENSAJES
 *  - fetchMessages: Obtiene todos los mensajes activos.
 *  - sendMessage: Envía un nuevo mensaje.
 *  - editMessage: Edita un mensaje existente.
 *  - deleteMessage: Elimina un mensaje.
 */

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

export async function editMessage(messageId, newContent) {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

    if (userError) throw userError;

    // if (!newContent?.trim()) throw new Error("Mensaje vacío");

    const encryptedContent = await encryptMessage(newContent);

    const { data, error } = await supabaseClient
        .from('tbl_messages')
        .update({ content: encryptedContent, edited: true })
        .eq('id', messageId)
        .eq('sender_id', user.id)
        .eq('active', true);

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

    const { error: updError } = await supabaseClient
        .from('tbl_starred_messages')
        .update({ active: false })
        .eq('message_id', messageId)
        .eq('active', true);

    if (updError) throw updError;
}