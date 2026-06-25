import { decryptMessage } from "../../utils/crypto";
import { supabaseClient } from "../../utils/supabase";
/**
 *  SERVICIO PARA MANEJAR LOS MENSAJES DESTACADOS
 *  - setStarredMessage: Marca un mensaje como destacado o lo desmarca si ya estaba destacado.
 *  - unStarredMessage: Quita el destacado de un mensaje.
 *  - fetchStarredMessages: Obtiene los mensajes destacados del usuario actual.
 */

// FUNCION PARA MARCAR UN MENSAJE COMO DESTACADO
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
        .maybeSingle();

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
        .update({ starred: true, starred_by: user.id })
        .eq('id', messageId)
        .eq('active', true);

    if (error) throw error;
}

// FUNCION PARA QUITAR EL DESTACADO DE UN MENSAJE
export async function unStarredMessage(messageId) {
    if (!messageId) return;
    const { error } = await supabaseClient
        .from('tbl_messages')
        .update({ starred: false })
        .eq('id', messageId)
        .eq('active', true);

    if (error) throw error;

    const { error: updError } = await supabaseClient
        .from('tbl_starred_messages')
        .update({ active: false, user_id: null })
        .eq('message_id', messageId)
        .eq('active', true);

    if (updError) throw updError;
}

// FUNCION PARA OBTENER LOS MENSAJES DESTACAOS DEL USUARIO
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
                created_at,               
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
        .order('created_at', {
            referencedTable: 'tbl_messages',
            ascending: false,
        })

    if (error) throw error;

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