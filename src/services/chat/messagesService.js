import { encryptMessage, decryptMessage } from "../../utils/crypto";
import { supabaseClient } from "../../utils/supabase";

// SUSCRIPCION PARA PODER OBTENER LOS MENSAJES CADA VEZ QUE SE INSERTE EN LA TABLA
export function subscribeToMessages(queryClient) {
    const channel = supabaseClient
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
                queryClient.setQueryData(
                    ['messages'],
                    (oldMessages = []) => [
                        ...oldMessages,
                        { ...payload.new, content: decryptedContent }
                    ]
                );
            }
        )
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
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        throw error;
    }

    return Promise.all(data.map(async (message) => ({
        ...message,
        content: await decryptMessage(message.content)
    })));
}

export async function sendMessage({ contain }) {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

    if (!contain?.trim()) throw new Error("Mensaje vacío");

    const encryptedContent = await encryptMessage(contain);

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
        .insert({ sender_id: user.id, receiver_id: otherUser.id, content: encryptedContent });

    if (error) throw error;

    return data;
}