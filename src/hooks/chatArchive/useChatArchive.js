import { fetchArchiveMessages } from '@/services/chatArchive/chatArchiveService';
import { useQuery } from '@tanstack/react-query';

export function useChatArchive() {
	return useQuery({
		queryKey: ['chat-archive-messages'],
		queryFn: fetchArchiveMessages,
		staleTime: Infinity, // Los mensajes históricos nunca cambian
		gcTime: 1000 * 60 * 60 * 24, // Mantener en caché 24 horas
		refetchOnWindowFocus: false,
	});
}

