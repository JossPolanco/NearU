// src/utils/parseWhatsApp.js

// Regex para línea cabecera: día/mes/año, hora:minuto [a. m. / p. m.] - Autor: Contenido
// Soporta espacio estrecho \u202f y autor
const HEADER_REGEX = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}), (\d{1,2}):(\d{2})\s?([ap])\.\s?m\.\s*-\s*([^:]+?):\s*([\s\S]*)$/iu;

// Regex para mensajes del sistema (cifrado, etc.)
const SYSTEM_REGEX = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}), (\d{1,2}):(\d{2})\s?([ap])\.\s?m\.\s*-\s*([^:]+)$/iu;

// Regex para detectar archivos adjuntos con LRM opcional (\u200e)
const ATTACHMENT_REGEX = /^\u200E?([A-Za-z0-9_-]+\.(opus|webp|jpg|jpeg|png|mp4|mp3|m4a|pdf))\s*\((?:archivo adjunto|file attached)\)\s*\n?([\s\S]*)$/iu;

/**
 * Normaliza año de 2 dígitos a 4 dígitos
 */
function parseFullYear(yy) {
	const y = parseInt(yy, 10);
	if (y < 100) return 2000 + y;
	return y;
}

/**
 * Parsea fecha y hora a objeto Date
 */
function createDateObj(d, m, y, h, min, meridiem) {
	let hour = parseInt(h, 10);
	const isPM = meridiem.toLowerCase() === 'p';
	if (isPM && hour < 12) hour += 12;
	if (!isPM && hour === 12) hour = 0;
	return new Date(parseFullYear(y), parseInt(m, 10) - 1, parseInt(d, 10), hour, parseInt(min, 10));
}

/**
 * Parsea el contenido en texto plano de messages.txt
 * @param {string} text - Contenido crudo del archivo messages.txt
 * @returns {Array} Mensajes estructurados
 */
export function parseWhatsAppMessages(text) {
	if (!text) return [];

	const lines = text.split(/\r?\n/);
	const rawList = [];

	for (const line of lines) {
		const headMatch = line.match(HEADER_REGEX);
		if (headMatch) {
			const [, d, m, y, h, min, meridiem, author, body] = headMatch;
			rawList.push({
				date: createDateObj(d, m, y, h, min, meridiem),
				rawTime: `${h}:${min} ${meridiem.toLowerCase() === 'p' ? 'p. m.' : 'a. m.'}`,
				author: author.trim(),
				text: body,
			});
			continue;
		}

		const sysMatch = line.match(SYSTEM_REGEX);
		if (sysMatch) {
			const [, d, m, y, h, min, meridiem, sysText] = sysMatch;
			rawList.push({
				date: createDateObj(d, m, y, h, min, meridiem),
				rawTime: `${h}:${min} ${meridiem.toLowerCase() === 'p' ? 'p. m.' : 'a. m.'}`,
				isSystem: true,
				text: sysText.trim(),
			});
			continue;
		}

		// Línea de continuación (multilínea)
		if (rawList.length > 0) {
			rawList[rawList.length - 1].text += '\n' + line;
		}
	}

	// Ahora procesamos los tipos de mensaje (audio, sticker, imagen, texto, etc.)
	const parsedMessages = [];

	for (let i = 0; i < rawList.length; i++) {
		const item = rawList[i];
		if (item.isSystem) {
			parsedMessages.push({
				id: i,
				date: item.date,
				rawTime: item.rawTime,
				type: 'system',
				text: item.text,
			});
			continue;
		}

		// Normalizar autor
		// Josué Polanco -> 'josue', Evelyn❤ -> 'evelyn'
		const isJosue = item.author.toLowerCase().includes('josu');
		const authorKey = isJosue ? 'josue' : 'evelyn';

		let content = item.text.trim();
		let isEdited = false;
		if (content.includes('<Se editó este mensaje.>')) {
			isEdited = true;
			content = content.replace(/<Se editó este mensaje\.>/g, '').trim();
		}

		const isDeleted = content.includes('Se eliminó este mensaje') || content.includes('Eliminaste este mensaje');
		const isOmitted = content.includes('<Multimedia omitido>');

		// Verificar si es adjunto
		const attMatch = content.match(ATTACHMENT_REGEX);

		if (attMatch) {
			const fileName = attMatch[1];
			const ext = attMatch[2].toLowerCase();
			const caption = attMatch[3] ? attMatch[3].trim() : '';

			let type = 'attachment';
			let storagePath = null;
			let altAudioPath = null;

			if (ext === 'webp') {
				type = 'sticker';
				storagePath = `stikers/${fileName}`;
			} else if (ext === 'opus' || ext === 'mp3' || ext === 'm4a') {
				type = 'audio';
				storagePath = `audios/${fileName}`;
				// Si es opus, tiene su gemelo m4a generado para Safari / iOS
				if (ext === 'opus') {
					altAudioPath = `audios/${fileName.replace(/\.opus$/i, '.m4a')}`;
				}
			} else if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
				type = 'image';
				storagePath = `img/${fileName}`;
			} else {
				// Videos u otros no disponibles físicamente
				type = 'missing';
			}

			parsedMessages.push({
				id: i,
				date: item.date,
				rawTime: item.rawTime,
				author: authorKey,
				authorName: item.author,
				type,
				fileName,
				storagePath,
				altAudioPath,
				caption,
				isEdited,
			});
			continue;
		}

		if (isDeleted) {
			parsedMessages.push({
				id: i,
				date: item.date,
				rawTime: item.rawTime,
				author: authorKey,
				authorName: item.author,
				type: 'deleted',
				text: 'Este mensaje fue eliminado',
			});
			continue;
		}

		if (isOmitted) {
			parsedMessages.push({
				id: i,
				date: item.date,
				rawTime: item.rawTime,
				author: authorKey,
				authorName: item.author,
				type: 'missing',
				text: 'Archivo multimedia no disponible',
			});
			continue;
		}

		// Mensaje de texto normal
		parsedMessages.push({
			id: i,
			date: item.date,
			rawTime: item.rawTime,
			author: authorKey,
			authorName: item.author,
			type: 'text',
			text: content,
			isEdited,
		});
	}

	return parsedMessages;
}

