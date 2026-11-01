import { useState, useMemo } from 'react';

/**
 * Normaliza texto eliminando acentos y convirtiendo a minúsculas
 */
function normalizeText(str) {
	if (!str) return '';
	return str
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
}

export function useChatSearch(messages = []) {
	const [query, setQuery] = useState('');
	const [currentIndex, setCurrentIndex] = useState(0);

	// Filtra y encuentra los IDs de los mensajes coincidentes
	const matchingMessageIds = useMemo(() => {
		const trimmed = query.trim();
		if (!trimmed || trimmed.length < 2) return [];

		const normQuery = normalizeText(trimmed);
		const matches = [];

		for (let i = 0; i < messages.length; i++) {
			const msg = messages[i];
			const textToSearch = (msg.text || '') + ' ' + (msg.caption || '');
			if (normalizeText(textToSearch).includes(normQuery)) {
				matches.push(i);
			}
		}

		return matches;
	}, [query, messages]);

	const totalMatches = matchingMessageIds.length;

	const currentMatchMessageIndex = useMemo(() => {
		if (totalMatches === 0) return null;
		return matchingMessageIds[currentIndex % totalMatches];
	}, [matchingMessageIds, currentIndex, totalMatches]);

	const goToNext = () => {
		if (totalMatches === 0) return;
		setCurrentIndex((prev) => (prev + 1) % totalMatches);
	};

	const goToPrev = () => {
		if (totalMatches === 0) return;
		setCurrentIndex((prev) => (prev - 1 + totalMatches) % totalMatches);
	};

	const clearSearch = () => {
		setQuery('');
		setCurrentIndex(0);
	};

	return {
		query,
		setQuery,
		totalMatches,
		currentMatchDisplayIndex: totalMatches > 0 ? (currentIndex % totalMatches) + 1 : 0,
		currentMatchMessageIndex,
		matchingMessageIdsSet: useMemo(() => new Set(matchingMessageIds), [matchingMessageIds]),
		goToNext,
		goToPrev,
		clearSearch,
	};
}

