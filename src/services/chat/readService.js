import { supabaseClient } from "../../utils/supabase";
/**
 *  SERVICIO PARA MARCAR MENSAJES COMO LEIDOS
 *  - markMessagesAsRead: Marca los mensajes como leídos.
 */

// FUNCION PARA MARCAR MENSAJES COMO LEIDOS
export async function markMessagesAsRead(messageIds) {
    if (!messageIds.length) return;

    const { error } = await supabaseClient
        .from('tbl_messages')
        .update({ read_at: new Date().toISOString() })
        .in('id', messageIds)
        .is('read_at', null);

    if (error) throw error;
}