import { supabaseClient } from "../../utils/supabase";

export async function loginUser({ email, password }) {
    const trimmedEmail = email.trim();

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
    })

    console.log("data en loginUser después de la llamada a supabase:", data);

    if (error) throw error;
    return data;
}

export async function registerUser({ email }) {
    const trimmedEmail = email.trim();

    const { data, error } = await supabaseClient.auth.signInWithOtp({
        email: trimmedEmail,
    });

    if (error) throw error;
    return data;
}

export async function logoutUser() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
}

export async function setUserPassword({ password, confirmPassword }) {
    if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
    }

    const { data, error } = await supabaseClient.auth.updateUser({
        password,
    });

    if (error) throw error;

    return data;
}