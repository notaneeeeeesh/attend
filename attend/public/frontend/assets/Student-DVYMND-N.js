import{r as _,c as n,k as h,o,a as m,h as a,l as g,m as u,w as O,t as b,f as p,e as T,u as J,i as k,_ as w}from"./index-Bkef9m5F.js";import{_ as z}from"./Tooltip.vue_vue_type_script_setup_true_lang-C2rvdq-6.js";const I={key:0},$={__name:"DaysList",props:{compStudId:String},setup(L){const i=L,d=_(),r=_(),t=n({url:"attend.api.fetchers.get_student_days_list"});t.submit({student:i.compStudId}),h(t,()=>{t.data!=""&&t.data&&(d.value=Object.keys(JSON.parse(JSON.stringify(t.data))[0]))}),h(d,()=>{r.value=JSON.parse(JSON.stringify(d.value)).map(f=>s[f])});const s={date:{label:"Date",key:"date",width:"300px"},login_time:{label:"Login time",key:"login_time",width:"300px"},logout_time:{label:"Logout Time",key:"logout_time",width:"300px"}};return(f,l)=>(o(),m("div",null,[r.value?(o(),m("div",I,[a(t)!=""&&r.value?(o(),g(a(z),{key:0,class:"h-[150px]",columns:r.value,rows:a(t).data,"row-key":"user",options:{selectable:!1}},null,8,["columns","rows"])):u("",!0)])):u("",!0)]))}},U={class:"m-10 bg-"},V={key:0,class:"text-3xl"},j={key:1},P={__name:"Student",setup(L){const i=new Date().toJSON().slice(0,10),d=J(),r=_(!1),t=_({dayExists:!1,nullLogin:!0,nullLogout:!0}),s=_(),f=n({url:"attend.api.roles.get_user_role",auto:!0});O(()=>{f.data==="Student"?d.push("/Student"):r.value=!0});const l=n({url:"frappe.auth.get_logged_user",auto:!0});h(l,()=>{y.reset(),y.submit({student:l.data}),c.submit({student:l.data})});const y=n({url:"attend.api.fetchers.get_student_from_id"}),c=n({url:"attend.api.fetchers.get_student_days_list"}),x=n({url:"attend.api.actions.student_create_day"}),D=n({url:"attend.api.actions.student_login"}),N=n({url:"attend.api.actions.student_logout"});h(c,()=>{if(c.data!=null)for(var S=c.data.length,e=0;e<S;e++){const v=c.data[e];if(v.date==i){t.value.dayExists=!0,v.login_time!=null&&(t.value.nullLogin=!1),v.logout_time!=null&&(t.value.nullLogout=!1),s.value=v;break}}});const E=()=>{s.value.login_time=new Date().toLocaleTimeString("en-US",{hour12:!1}),D.submit({student:l.data,date:i,time:s.value.login_time}),window.location.reload()},B=()=>{s.value.logout_time=new Date().toLocaleTimeString("en-US",{hour12:!1}),N.submit({student:l.data,date:i,time:s.value.logout_time}),window.location.reload()},C=()=>{x.submit({student:l.data,date:i}),window.location.reload(),console.log("Creating new day entry!")},R=()=>{console.log(s.value),console.log(t.value)};return(S,e)=>(o(),m("div",U,[a(y).data?(o(),m("h1",V,"Hello "+b(a(y).data[0].full_name)+", it is "+b(a(i)),1)):u("",!0),t.value.dayExists&&!t.value.nullLogin&&!t.value.nullLogout?(o(),m("h2",j,"You're Done With work for today!")):u("",!0),a(l).data?(o(),g($,{key:2,compStudId:a(l).data},null,8,["compStudId"])):u("",!0),t.value.dayExists?u("",!0):(o(),g(a(w),{key:3,variant:"outline",theme:"gray",size:"lg",label:"Button",loading:!1,onClick:C},{default:p(()=>e[0]||(e[0]=[k(" New Day? ")])),_:1})),t.value.dayExists&&t.value.nullLogin&&t.value.nullLogout?(o(),g(a(w),{key:4,variant:"outline",theme:"gray",size:"lg",label:"Button",loading:!1,onClick:E},{default:p(()=>e[1]||(e[1]=[k(" Login ")])),_:1})):u("",!0),t.value.dayExists&&!t.value.nullLogin&&t.value.nullLogout?(o(),g(a(w),{key:5,variant:"outline",theme:"gray",size:"lg",label:"Button",loading:!1,onClick:B},{default:p(()=>e[2]||(e[2]=[k(" Logout ")])),_:1})):u("",!0),T(a(w),{variant:"outline",theme:"gray",size:"lg",label:"Button",loading:!1,onClick:R},{default:p(()=>e[3]||(e[3]=[k(" Print Today ")])),_:1})]))}};export{P as default};
