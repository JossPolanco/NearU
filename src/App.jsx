import { supabaseClient } from "./utils/supabase"
import {React, useEffect} from "react"
import Login from "./pages/Login";

export default function App() {

    useEffect(() => {
         supabaseClient.auth.onAuthStateChange((event, session) => {
            console.log("Auth state changed:", event, session);
        });
    })
    
    return (
        <Login />
    )
}