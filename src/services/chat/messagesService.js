import { supabaseClient } from "../../utils/supabase";

export async function fetchMessages() {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

    if (userError) {
        throw userError;
    }

    const { data, error } = await supabaseClient
        .from('tbl_messages')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        throw error;
    }

    return data;
}

export async function sendMessage({ contain }) {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

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
        .insert({ sender_id: user.id, receiver_id: otherUser.id, content: contain });

    if (error) throw error;

    return data;
}