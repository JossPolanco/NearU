import { parseWhatsAppMessages } from '../../utils/parseWhatsApp';
import { supabaseClient } from '../../utils/supabase';

const BUCKET = 'chat-archive';

/**
 * Descarga y parsea el archivo messages.txt desde Supabase Storage
 */
export async function fetchArchiveMessages() {
	const { data, error } = await supabaseClient.storage
		.from(BUCKET)
		.download('messages.txt');

	if (error) {
		throw new Error(`Error descargando messages.txt: ${error.message}`);
	}

	const text = await data.text();
	return parseWhatsAppMessages(text);
}

// Caché en memoria para URLs firmadas para evitar recalcular
const signedUrlsCache = new Map();

/**
 * Genera una URL firmada de forma segura para un recurso en el bucket chat-archive
 * Expira en 6 horas (21600 segundos)
 */
export async function getArchiveFileUrl(storagePath) {
	if (!storagePath) return null;

	const cached = signedUrlsCache.get(storagePath);
	if (cached && cached.expiresAt > Date.now()) {
		return cached.url;
	}

	const { data, error } = await supabaseClient.storage
		.from(BUCKET)
		.createSignedUrl(storagePath, 60 * 60 * 6);

	if (error || !data?.signedUrl) {
		console.warn(`No se pudo obtener URL firmada para ${storagePath}:`, error?.message);
		return null;
	}

	signedUrlsCache.set(storagePath, {
		url: data.signedUrl,
		expiresAt: Date.now() + 5.5 * 60 * 60 * 1000, // 5.5 horas de validez local
	});

	return data.signedUrl;
}

