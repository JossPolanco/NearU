import { supabaseClient } from "../../../../src/utils/supabase";

export async function createGame({ secretWord, hint1, hint2, hint3, drawId,  }) {
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError) {
        throw userError;
    }

    const { error } = await supabaseClient
        .from("tbl_drawing_games")
        .insert({
            creator_id: user.id,
            secret_word: secretWord,
            hint_1: hint1,
            hint_2: hint2,
            hint_3: hint3,
            storage_path: drawId,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }
}