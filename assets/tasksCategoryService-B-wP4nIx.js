import{s as i}from"./supabase-config-dcxlkF4m.js";async function l({title:a,description:t,icon:e}){const{data:s,error:r}=await i.from("tbl_tasks_category").insert({title:a,description:t,icon:e});if(r)throw r;return s}async function p({id:a,title:t,description:e,icon:s}){const{data:r,error:o}=await i.from("tbl_tasks_category").update({title:t,description:e,icon:s}).eq("id",a);if(o)throw o;return r}async function u({id:a}){const{data:t,error:e}=await i.from("tbl_tasks_category").update({active:!1}).eq("id",a);if(e)throw e;return t}async function f(){const{data:a,error:t}=await i.from("tbl_tasks_category").select(`
            id,
            title,
            description,
            icon,
            tbl_tasks (
                completed,
                active
            )
        `).eq("active",!0).eq("tbl_tasks.active",!0);if(t)throw t;return a.map(s=>{const r=s.tbl_tasks||[],o=r.length,n=r.filter(c=>c.completed).length;return{id:s.id,title:s.title,description:s.description,icon:s.icon,totalTask:o,completedTask:n}})}async function k(a){const{data:t,error:e}=await i.from("tbl_tasks_category").select("id, title, description").eq("id",a).eq("active",!0).single();if(e)throw e;return t}export{k as a,l as c,u as d,f as g,p as u};
