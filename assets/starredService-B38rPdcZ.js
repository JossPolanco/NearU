import{s as n}from"./supabase-config-dcxlkF4m.js";const d="AES-GCM";async function u(){throw new Error("VITE_ENCRYPTION_KEY no definida")}async function l(e){const r=await u(),s=new TextEncoder,t=crypto.getRandomValues(new Uint8Array(12)),i=await crypto.subtle.encrypt({name:d,iv:t},r,s.encode(e)),a=new Uint8Array(t.byteLength+i.byteLength);return a.set(t,0),a.set(new Uint8Array(i),t.byteLength),btoa(String.fromCharCode(...a))}async function c(e){try{const r=await u(),s=Uint8Array.from(atob(e),o=>o.charCodeAt(0)),t=s.slice(0,12),i=s.slice(12),a=await crypto.subtle.decrypt({name:d,iv:t},r,i);return new TextDecoder().decode(a)}catch{return e}}async function f(e){const{data:{user:r},error:s}=await n.auth.getUser();if(s)throw s;if(!e)return;const{data:t}=await n.from("tbl_starred_messages").select("id, active").eq("message_id",e).eq("user_id",r.id).maybeSingle();if(t){const{data:a,error:o}=await n.from("tbl_starred_messages").update({active:!t.active}).eq("id",t.id);if(o)throw o}else{const{data:a,error:o}=await n.from("tbl_starred_messages").insert({message_id:e,user_id:r.id});if(o)throw o}const{error:i}=await n.from("tbl_messages").update({starred:!0,starred_by:r.id}).eq("id",e).eq("active",!0);if(i)throw i}async function w(e){if(!e)return;const{error:r}=await n.from("tbl_messages").update({starred:!1}).eq("id",e).eq("active",!0);if(r)throw r;const{error:s}=await n.from("tbl_starred_messages").update({active:!1,user_id:null}).eq("message_id",e).eq("active",!0);if(s)throw s}async function y(){const{data:{user:e},error:r}=await n.auth.getUser();if(r)throw r;const{data:s,error:t}=await n.from("tbl_starred_messages").select(`
            id,
            active,
            created_at,
            tbl_messages (
                id,
                content,
                sender_id,
                starred_by, 
                created_at,               
                reply_to_id,
                reply_preview,
                replied_message:reply_to_id (
                    id,
                    sender_id
                )
            )
        `).eq("active",!0).eq("user_id",e.id).order("created_at",{referencedTable:"tbl_messages",ascending:!1});if(t)throw t;const i=s.map(a=>a.tbl_messages);if(t)throw t;return Promise.all(i.map(async a=>({...a,content:await c(a.content),reply_preview:a.reply_preview?await c(a.reply_preview):null})))}export{c as d,l as e,y as f,f as s,w as u};
