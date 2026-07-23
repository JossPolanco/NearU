import{s as i}from"./supabase-config-dcxlkF4m.js";const d="AES-GCM",y=256;async function p(e){const t=new TextEncoder,a=await crypto.subtle.importKey("raw",t.encode(e),"PBKDF2",!1,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt:t.encode("couple-app-salt-v1"),iterations:1e5,hash:"SHA-256"},a,{name:d,length:y},!1,["encrypt","decrypt"])}let c=null;async function u(){return c||(c=await p("supaowPQyRQ_RdEwm8SESklmsmZsMzjPwQj"),c)}async function _(e){const t=await u(),a=new TextEncoder,r=crypto.getRandomValues(new Uint8Array(12)),n=await crypto.subtle.encrypt({name:d,iv:r},t,a.encode(e)),s=new Uint8Array(r.byteLength+n.byteLength);return s.set(r,0),s.set(new Uint8Array(n),r.byteLength),btoa(String.fromCharCode(...s))}async function l(e){try{const t=await u(),a=Uint8Array.from(atob(e),o=>o.charCodeAt(0)),r=a.slice(0,12),n=a.slice(12),s=await crypto.subtle.decrypt({name:d,iv:r},t,n);return new TextDecoder().decode(s)}catch{return e}}async function f(e){const{data:{user:t},error:a}=await i.auth.getUser();if(a)throw a;if(!e)return;const{data:r}=await i.from("tbl_starred_messages").select("id, active").eq("message_id",e).eq("user_id",t.id).maybeSingle();if(r){const{data:s,error:o}=await i.from("tbl_starred_messages").update({active:!r.active}).eq("id",r.id);if(o)throw o}else{const{data:s,error:o}=await i.from("tbl_starred_messages").insert({message_id:e,user_id:t.id});if(o)throw o}const{error:n}=await i.from("tbl_messages").update({starred:!0,starred_by:t.id}).eq("id",e).eq("active",!0);if(n)throw n}async function m(e){if(!e)return;const{error:t}=await i.from("tbl_messages").update({starred:!1}).eq("id",e).eq("active",!0);if(t)throw t;const{error:a}=await i.from("tbl_starred_messages").update({active:!1,user_id:null}).eq("message_id",e).eq("active",!0);if(a)throw a}async function b(){const{data:{user:e},error:t}=await i.auth.getUser();if(t)throw t;const{data:a,error:r}=await i.from("tbl_starred_messages").select(`
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
        `).eq("active",!0).eq("user_id",e.id).order("created_at",{referencedTable:"tbl_messages",ascending:!1});if(r)throw r;const n=a.map(s=>s.tbl_messages);if(r)throw r;return Promise.all(n.map(async s=>({...s,content:await l(s.content),reply_preview:s.reply_preview?await l(s.reply_preview):null})))}export{l as d,_ as e,b as f,f as s,m as u};
