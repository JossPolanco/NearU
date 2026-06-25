import { markMessagesAsRead } from "../../services/chat";
import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useReadReceipts(messages, userId) {
    const queryClient = useQueryClient();
    const observerRef = useRef(null);
    const pendingRef = useRef(new Set()); // IDs PENDIENTES
    const timerRef = useRef(null);

    // ENVIA EL MENSAJE COMO LEÍDO Y HACE OPTIMISTIC UPDATE EN CACHE
    const flush = useCallback(async () => {
        const ids = [...pendingRef.current];
        if (!ids.length) return;
        pendingRef.current.clear();

        try {
            await markMessagesAsRead(ids);
            // MARCAR COMO LEÍDOS EN CACHE (optimistic update)
            queryClient.setQueryData(['messages'], (old = []) =>
                old.map(m =>
                    ids.includes(m.id)
                        ? { ...m, read_at: new Date().toISOString() }
                        : m
                )
            );
        } catch (err) {
            console.error('Error marcando mensajes como leídos:', err);
        }
    }, [queryClient]);

    // ACUMULA IDS DE MENSAJES VISTOS Y LOS ENVÍA EN BATCH CADA 800ms
    const scheduleFlush = useCallback((id) => {
        pendingRef.current.add(id);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(flush, 800);
    }, [flush]);

    useEffect(() => {
        // SOLO EL RECEPTOR SE PREOCUPA POR LOS LEÍDOS, EL SENDER YA SABE QUE LOS ENVIÓ
        const unreadFromOther = messages?.filter(
            m => m.sender_id !== userId && !m.read_at
        ) ?? [];

        if (!unreadFromOther.length) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const id = entry.target.dataset.messageId;
                    if (!id) return;
                    scheduleFlush(id);
                    // DEJA DE OBSERVAR ESTE MENSAJE, YA SE MARCÓ COMO LEÍDO
                    observerRef.current?.unobserve(entry.target);
                });
            },
            { threshold: 0.6 } // AL MENOS EL 60% DEL MENSAJE VISIBLE PARA MARCAR COMO LEÍDO
        );

        // OBSERVAR SOLO LOS MENSAJES NO LEÍDOS DEL OTRO USUARIO
        unreadFromOther.forEach(m => {
            const el = document.querySelector(`[data-message-id="${m.id}"]`);
            if (el) observerRef.current?.observe(el);
        });

        return () => {
            observerRef.current?.disconnect();
            clearTimeout(timerRef.current);
        };
    }, [messages, userId, scheduleFlush]);
}