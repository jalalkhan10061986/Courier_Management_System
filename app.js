const ST={"Pending":10,"Picked up":35,"In transit":65,"Out for delivery":85,"Delivered":100,"Cancelled":0};
const NAV=[["dash","▣","Dashboard"],["ship","▤","Shipments"],["cour","➤","Couriers"],["track","⌖","Track"],["data","{ }","Data"]];
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const cls=s=>"s-"+s.replace(/ /g,"-");
const today=()=>new Date().toISOString().slice(0,10);
let db,view="dash",filter="All",trackId="";
try{db=JSON.parse(localStorage.getItem("parcelo-db"))}catch(e){}
const hadSaved=!!(db&&db.shipments&&db.couriers);if(!hadSaved)db=JSON.parse($("#seed").textContent);
const save=()=>{try{localStorage.setItem("parcelo-db",JSON.stringify(db))}catch(e){}};
const cname=id=>(db.couriers.find(c=>c.id===id)||{name:"Unassigned"}).name;
const badge=s=>`<span class="badge ${cls(s)}">${s}</span>`;
const pill=s=>`<span class="pill">${ST[s]}%</span>`;
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2000)}
function nav(){$("#nav").innerHTML=NAV.map(n=>`<button data-v="${n[0]}" class="${view===n[0]?"on":""}"><i>${n[1]}</i>${n[2]}</button>`).join("")}
function go(v){view=v;$("#side").classList.remove("open");render()}
function rows(list,full){
 if(!list.length)return `<div class="empty">No shipments match. Clear the search or create a new shipment.</div>`;
 return `<div class="wrap"><table><tr><th>ID</th><th>Receiver</th><th>City</th><th>Courier</th><th>Status</th>${full?"<th>Update</th>":"<th>Progress</th>"}</tr>`+
 list.map(s=>`<tr><td>${s.id}</td><td>${esc(s.receiver)}</td><td>${esc(s.city)}</td><td>${esc(cname(s.courier))}</td><td>${badge(s.status)}</td>`+
 (full?`<td><select data-id="${s.id}" class="st" aria-label="Status of ${s.id}">${Object.keys(ST).map(k=>`<option${k===s.status?" selected":""}>${k}</option>`).join("")}</select> <button class="btn del" data-del="${s.id}" aria-label="Delete ${s.id}">✕</button></td>`:`<td>${pill(s.status)}</td>`)+`</tr>`).join("")+`</table></div>`}
function dash(){
 const S=db.shipments,n=f=>S.filter(f).length;
 const act=n(s=>!["Delivered","Cancelled"].includes(s.status));
 const cities={};S.forEach(s=>cities[s.city]=(cities[s.city]||0)+1);
 const max=Math.max(1,...Object.values(cities));
 const card=(c,num,t,sub,ic)=>`<div class="stat" style="background:${c}"><div><div class="n">${num}</div><h3>${t}</h3><small>${sub}</small></div><div class="c" style="color:${c}">${ic}</div></div>`;
 return `<div class="stats">
 ${card("var(--violet)",S.length,"Total shipments","All time","▤")}
 ${card("var(--teal)",n(s=>s.status==="Delivered"),"Delivered","Completed successfully","✓")}
 ${card("#d9532f",act,"On the move","Awaiting delivery","➤")}
 ${card("#2579b8",db.couriers.filter(c=>c.active).length,"Active couriers",`${db.couriers.length} on the team`,"☺")}</div>
 <div class="grid2"><div class="panel"><h2>Recent shipments</h2>${rows(S.slice().sort((a,b)=>b.id.localeCompare(a.id)).slice(0,6),false)}</div>
 <div class="panel"><h2>Deliveries by city</h2><div style="padding-top:6px">${Object.entries(cities).sort((a,b)=>b[1]-a[1]).map(([c,v])=>`<div class="bar"><span>${esc(c)}</span><div><i style="width:${v/max*100}%"></i></div><b>${v}</b></div>`).join("")}</div></div></div>`}
function ship(){
 const q=$("#q").value.trim().toLowerCase();
 const list=db.shipments.filter(s=>(filter==="All"||s.status===filter)&&(!q||[s.id,s.sender,s.receiver,s.city].join(" ").toLowerCase().includes(q)));
 return `<div class="tools"><button class="btn" id="add">+ New shipment</button><select id="flt" aria-label="Filter by status">${["All",...Object.keys(ST)].map(k=>`<option${k===filter?" selected":""}>${k}</option>`).join("")}</select></div><div class="panel"><h2>Shipments (${list.length})</h2>${rows(list,true)}</div>`}
function cour(){
 return `<div class="cour">`+db.couriers.map(c=>{const m=db.shipments.filter(s=>s.courier===c.id),a=m.filter(s=>!["Delivered","Cancelled"].includes(s.status)).length;
 return `<div class="cc ${c.active?"":"off"}"><h3>${esc(c.name)}</h3><p>${esc(c.zone)} zone · ${esc(c.phone)}</p><p><b>${a}</b> active · <b>${m.length}</b> total</p><button class="btn alt" data-tg="${c.id}">${c.active?"Set off duty":"Set on duty"}</button></div>`}).join("")+`</div>`}
function track(){
 const s=db.shipments.find(x=>x.id.toLowerCase()===trackId.toLowerCase());
 let out=`<div class="panel" style="max-width:640px"><h2>Track a shipment</h2><div class="tools"><input id="tid" placeholder="e.g. PCL-1002" value="${esc(trackId)}" aria-label="Shipment ID"><button class="btn" id="go">Track shipment</button></div>`;
 if(trackId&&!s)out+=`<div class="empty">No shipment found with ID “${esc(trackId)}”. Check the ID and try again.</div>`;
 if(s)out+=`<h3 style="margin:6px 0">${s.id} ${badge(s.status)}</h3><p style="color:var(--muted);margin:0">${esc(s.sender)} → ${esc(s.receiver)}, ${esc(s.city)} · Courier: ${esc(cname(s.courier))}</p><ul class="tl">${s.history.slice().reverse().map(h=>`<li><b>${h[0]}</b><small>${h[1]}</small></li>`).join("")}</ul>`;
 return out+`</div>`}
function data(){
 return `<div class="panel" style="padding-bottom:18px"><h2>Data (JSON)</h2><p style="color:var(--muted)">Your shipments and couriers are stored as JSON in this browser. Copy it to back up, or paste JSON and apply it to restore.</p><textarea id="js" spellcheck="false">${esc(JSON.stringify(db,null,1))}</textarea><div class="tools" style="margin:12px 0 0"><button class="btn" id="cp">Copy JSON</button><button class="btn alt" id="ap">Apply JSON</button><button class="btn alt" id="rs">Reset to sample data</button></div></div>`}
function render(){
 nav();$("#view").innerHTML={dash,ship,cour,track,data}[view]();
 $("#bA").textContent=db.shipments.filter(s=>!["Delivered","Cancelled"].includes(s.status)).length}
function setStatus(id,st){const s=db.shipments.find(x=>x.id===id);s.status=st;s.history.push([st,today()]);save();render();toast(id+" updated to "+st)}

$("#nav").onclick=e=>{const b=e.target.closest("button");if(b)go(b.dataset.v)};
$("#burger").onclick=$("#mb").onclick=()=>$("#side").classList.toggle("open");
$("#q").oninput=()=>{if(view!=="ship"){view="ship"}render();const i=$("#q");}
$("#theme").onclick=()=>{const r=document.documentElement,d=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=d?"light":"dark"};
$("#view").onclick=e=>{
 const t=e.target;
 if(t.id==="add"){$("#fK").innerHTML=db.couriers.filter(c=>c.active).map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("");["fS","fR","fC"].forEach(i=>$("#"+i).value="");$("#dlg").showModal()}
 if(t.dataset.del&&confirm("Delete "+t.dataset.del+"?")){db.shipments=db.shipments.filter(s=>s.id!==t.dataset.del);save();render();toast("Shipment deleted")}
 if(t.dataset.tg){const c=db.couriers.find(x=>x.id===t.dataset.tg);c.active=!c.active;save();render()}
 if(t.id==="go"){trackId=$("#tid").value.trim();render()}
 if(t.id==="cp"){const x=$("#js");x.select();try{navigator.clipboard.writeText(x.value);toast("JSON copied")}catch(_){document.execCommand&&document.execCommand("copy");toast("JSON copied")}}
 if(t.id==="ap"){try{const o=JSON.parse($("#js").value);if(!Array.isArray(o.shipments)||!Array.isArray(o.couriers))throw 0;db=o;save();render();toast("JSON applied")}catch(_){toast("Invalid JSON: needs shipments and couriers arrays")}}
 if(t.id==="rs"){db=JSON.parse($("#seed").textContent);save();render();toast("Sample data restored")}
};
$("#view").onchange=e=>{if(e.target.id==="flt"){filter=e.target.value;render()}if(e.target.classList.contains("st"))setStatus(e.target.dataset.id,e.target.value)};
$("#view").onkeydown=e=>{if(e.key==="Enter"&&e.target.id==="tid"){trackId=e.target.value.trim();render()}};
$("#fX").onclick=()=>$("#dlg").close();
$("#fOk").onclick=()=>{
 const v=i=>$("#"+i).value.trim();
 if(!v("fS")||!v("fR")||!v("fC")){toast("Fill in sender, receiver and city");return}
 const next=Math.max(1000,...db.shipments.map(s=>+s.id.split("-")[1]))+1,id="PCL-"+next;
 db.shipments.push({id,sender:v("fS"),receiver:v("fR"),city:v("fC"),courier:$("#fK").value,status:"Pending",created:today(),history:[["Pending",today()]]});
 save();$("#dlg").close();view="ship";filter="All";$("#q").value="";render();toast(id+" created")};
render();
fetch("data.json").then(r=>r.ok?r.json():null).then(j=>{if(j&&!hadSaved){db=j;render()}}).catch(()=>{});
