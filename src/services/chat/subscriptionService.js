import { decryptMessage } from "../../utils/crypto";
import { supabaseClient } from "../../utils/supabase";

/**
 *  SERVICIO PARA GESTIONAR LAS SUSCRIPCIONES A LOS MENSAJES
 *  - subscribeToMessages: Suscribe al cliente para recibir notificaciones de nuevos mensajes.
 */

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
                        starred: payload.new.starred,
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