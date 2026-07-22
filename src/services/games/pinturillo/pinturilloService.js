import { supabaseClient } from "../../../../src/utils/supabase";

export async function createGame({ secretWord, hint1, hint2, hint3, drawId, }) {
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

// export async function getCountResolvedDraws() {
//     const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

//     if (userError) {
//         throw userError;
//     }

//     const { data: count, error } = await supabaseClient
//         .from("tbl_drawing_games")
//         .select("id", { count: "exact" })
//         .eq("resolved", true)
//         .eq("creator_id", user.id);

//     if (error) {
//         throw error;
//     }

//     return count;
// }

export async function getNoResolvedDraws() {
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError) {
        throw userError;
    }

    const { data: draws, error } = await supabaseClient
        .from("tbl_drawing_games")
        .select(`
            id,            
            created_at,
            creator_id
         `)
        .neq("creator_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return draws;
}

export async function getPinturilloGame(id) {
    const { data, error } = await supabaseClient
        .from("tbl_drawing_games")
        .select(`
            id,            
            secret_word,
            hint_1,
            hint_2,
            hint_3,
            image_metadata (                
                storage_path,
                bucket
            )
        `)
        .eq("id", id)
        .single();

    if (error) {
        throw error;
    }

    return data;
}   

export async function updateGameStatus(id, status) {
    const updatePayload = { status };
    if (status === 'solved') {
        updatePayload.solved_at = new Date().toISOString();
    }

    const { data, error } = await supabaseClient
        .from("tbl_drawing_games")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
}

export async function getPinturilloScores() {
    const { data, error } = await supabaseClient
        .from("tbl_drawing_guesses")
        .select("guesser_id")
        .eq("is_correct", true);

    if (error) {
        throw error;
    }

    const scores = {};
    if (data) {
        data.forEach(item => {
            if (item.guesser_id) {
                scores[item.guesser_id] = (scores[item.guesser_id] || 0) + 1;
            }
        });
    }

    return scores;
}

export async function getPinturilloHistory({ page = 1, limit = 5 } = {}) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabaseClient
        .from("tbl_drawing_games")
        .select(`
            id,
            secret_word,
            created_at,
            solved_at,
            creator_id,
            status,
            image_metadata (
                storage_path,
                bucket
            )
        `, { count: "exact" })
        .eq("status", "solved")
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        throw error;
    }

    return {
        draws: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / limit) || 1,
        currentPage: page
    };
}

