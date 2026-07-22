import { supabaseClient } from "../../../../src/utils/supabase";

export async function createGuess({ gameId, guess, isCorrect, attempt }) {
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError) {
        throw userError;
    }

    // QUERY PARA ACTUALIZAR O INSERTAR INTENTOS EN EL JUEGO
    const { data: existingData, error: fetchError } = await supabaseClient
        .from('tbl_drawing_guesses')
        .select('*')
        .eq('game_id', gameId)
        .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
    }

    // SI NO EXISTE SE CREA UN NUEVO REGISTREO
    const currentAttempts = existingData?.guess?.attempts || [];
    
    // CREA UN NUEVO INTENTO
    const newAttemptItem = {
        guess,
        attempt: attempt || currentAttempts.length + 1,
        is_correct: isCorrect
    };

    // AGREGA EL NUEVO INTENTO A LA LISTA
    const updatedAttempts = [...currentAttempts, newAttemptItem];
    const newGuessPayload = { attempts: updatedAttempts };

    let resultData;

    // SE ACTUALIZA SI YA EXISTE REGISTRO
    if (existingData?.id) {
        const { data, error } = await supabaseClient
            .from('tbl_drawing_guesses')
            .update({
                guess: newGuessPayload,
                is_correct: isCorrect,
                guesser_id: user.id
            })
            .eq('id', existingData.id)
            .select();

        if (error) throw error;
        resultData = data && data.length > 0 ? data[0] : { ...existingData, guess: newGuessPayload, is_correct: isCorrect };
    } else {
        // SE INSERTA SI ES EL PRIMER INTENTO
        const { data, error } = await supabaseClient
            .from('tbl_drawing_guesses')
            .insert({
                game_id: gameId,
                guesser_id: user.id,
                is_correct: isCorrect,
                guess: newGuessPayload
            })
            .select();

        if (error) throw error;
        resultData = data && data.length > 0 ? data[0] : null;
    }
        
    return resultData;
}

export async function getGameGuesses(gameId) {
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError) {
        throw userError;
    }

    const { data, error } = await supabaseClient
        .from('tbl_drawing_guesses')
        .select('*')
        .eq('game_id', gameId)
        .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return [];

    const rawAttempts = data.guess?.attempts || [];

    return rawAttempts.map((item, index) => {
        if (typeof item === 'string') {
            const isLast = index === rawAttempts.length - 1;
            return {
                guess: item,
                attempt: index + 1,
                is_correct: isLast ? Boolean(data.is_correct) : false,
                correct: isLast ? Boolean(data.is_correct) : false
            };
        }
        return {
            ...item,
            guess: item.guess || item.word || String(item),
            attempt: item.attempt || index + 1,
            is_correct: item.is_correct ?? item.correct ?? false,
            correct: item.is_correct ?? item.correct ?? false
        };
    });
}

