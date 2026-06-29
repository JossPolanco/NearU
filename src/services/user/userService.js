import { supabaseClient } from "../../utils/supabase";

export async function updateInfo({ name, nickname }) {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

    if (userError) {
        throw userError;
    }

    // ACTUALIZAR SOLO LOS CAMPOS QUE SE HAYAN PROPORCIONADO
    const updates = {};

    if (name !== undefined) {
        updates.display_name = name;
    }

    if (nickname !== undefined) {
        updates.nickname = nickname;
    }

    const result = await supabaseClient
        .from("tbl_profiles")
        .update(updates)
        .eq("id", user.id)
        .select("*");

    return result;
}

export async function getUserProfile() {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

    if (userError) {
        throw userError;
    }

    const result = await supabaseClient
        .from("tbl_profiles")
        .select("display_name, nickname, avatar_url")
        .eq("id", user.id)
        .single();

    return result.data;
}

export async function getPartnerProfile() {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

    if (userError) {
        throw userError;
    }

    const result = await supabaseClient
        .from("tbl_profiles")
        .select("display_name, nickname, avatar_url")
        .neq("id", user.id)
        .single();

    return result.data;
}

export async function getUserId() {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

    if (userError) {
        throw userError;
    }

    return user.id;
}

export async function getCurrentUser() {
    const { data: { user }, error: userError, } = await supabaseClient.auth.getUser();

    if (userError) {
        throw userError;
    }

    return user;
}