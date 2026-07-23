import{s}from"./supabase-config-dcxlkF4m.js";async function u({secretWord:r,hint1:e,hint2:t,hint3:a,drawId:o}){const{data:{user:i},error:n}=await s.auth.getUser();if(n)throw n;const{error:c}=await s.from("tbl_drawing_games").insert({creator_id:i.id,secret_word:r,hint_1:e,hint_2:t,hint_3:a,storage_path:o}).select().single();if(c)throw c}async function _(){const{data:{user:r},error:e}=await s.auth.getUser();if(e)throw e;const{data:t,error:a}=await s.from("tbl_drawing_games").select(`
            id,            
            created_at,
            creator_id
         `).neq("creator_id",r.id).eq("status","active").order("created_at",{ascending:!1});if(a)throw a;return t}async function g(r){const{data:e,error:t}=await s.from("tbl_drawing_games").select(`
            id,            
            secret_word,
            hint_1,
            hint_2,
            hint_3,
            image_metadata (                
                storage_path,
                bucket
            )
        `).eq("id",r).single();if(t)throw t;return e}async function l(r,e){const t={status:e};t.solved_at=new Date().toISOString();const{data:a,error:o}=await s.from("tbl_drawing_games").update(t).eq("id",r).select().maybeSingle();if(o)throw o;return a}async function w(){const{data:r,error:e}=await s.from("tbl_drawing_guesses").select("guesser_id").eq("is_correct",!0);if(e)throw e;const t={};return r&&r.forEach(a=>{a.guesser_id&&(t[a.guesser_id]=(t[a.guesser_id]||0)+1)}),t}async function f({page:r=1,limit:e=5}={}){const t=(r-1)*e,a=t+e-1,{data:o,count:i,error:n}=await s.from("tbl_drawing_games").select(`
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
        `,{count:"exact"}).eq("status","solved").order("created_at",{ascending:!1}).range(t,a);if(n)throw n;return{draws:o||[],totalCount:i||0,totalPages:Math.ceil((i||0)/e)||1,currentPage:r}}export{_ as a,f as b,u as c,g as d,w as g,l as u};
