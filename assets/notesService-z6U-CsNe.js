import{s as a}from"./supabase-config-dcxlkF4m.js";async function d({title:e,image_id:t,image_metadata_id:i}){const{data:{user:r},error:o}=await a.auth.getUser();if(o)throw o;const{data:c,error:s}=await a.from("tbl_notes").insert({title:e,image_id:t||i,created_by:r.id}).select().single();if(s)throw s;return c}async function f(){const{data:e,error:t}=await a.from("tbl_notes").select(`
            id,
            title,
            created_at,
            created_by,
            image_id,
            favorite,
            image_metadata (
                id,
                storage_path,
                bucket
            )
        `).eq("active",!0).order("created_at",{ascending:!1});if(t)throw t;return e}async function _(){const{data:e,error:t}=await a.from("tbl_notes").select(`
            id,
            title,
            created_at,
            created_by,
            image_id,
            favorite,
            image_metadata (
                id,
                storage_path,
                bucket
            )
        `).eq("active",!0).order("created_at",{ascending:!1}).limit(5);if(t)throw t;return e}async function g(e,t){const{data:i,error:r}=await a.from("tbl_notes").update({favorite:!t}).eq("id",e).select().single();if(r)throw r;return i}async function l(){const{data:e,error:t}=await a.from("tbl_notes").select(`
            id,
            title,
            created_at,
            created_by,
            image_id,
            favorite,
            image_metadata (
                id,
                storage_path,
                bucket
            )
        `).eq("active",!0).eq("favorite",!0).order("created_at",{ascending:!1});if(t)throw t;return e}export{l as a,f as b,d as c,_ as g,g as t};
