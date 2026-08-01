const WA_NUMBER = "573045567944";
const money = n => "$" + n.toLocaleString("es-CO");

/* ---------- placeholder catalog ---------- */
const PRODUCTS = [
  {id:1, name:"Real Madrid", sub:"Local 24/25", league:"LaLiga", type:"Player", price:120000, promo:99000, dorsal:"7", c1:"#2a3550", c2:"#0f1422", sizes:["S","M","L","XL"], out:["XXL"]},
  {id:2, name:"Barcelona", sub:"Local 24/25", league:"LaLiga", type:"Fan", price:75000, promo:null, dorsal:"10", c1:"#1b2a6b", c2:"#7a1230", sizes:["S","M","L","XL","XXL"], out:[]},
  {id:3, name:"Man City", sub:"Local 24/25", league:"Premier League", type:"Player", price:120000, promo:null, dorsal:"9", c1:"#3a7fb0", c2:"#173a4f", sizes:["M","L","XL"], out:["S","XXL"]},
  {id:4, name:"Liverpool", sub:"Local 24/25", league:"Premier League", type:"Fan", price:75000, promo:null, dorsal:"11", c1:"#7a1220", c2:"#3f0810", sizes:["S","M","L"], out:["XL","XXL"]},
  {id:5, name:"Inter Miami", sub:"Local · Rosa", league:"MLS", type:"Fan", price:82000, promo:null, dorsal:"10", c1:"#e0759f", c2:"#7a2f56", sizes:["S","M","L","XL"], out:[]},
  {id:6, name:"Juventus", sub:"Local 24/25", league:"Serie A", type:"Player", price:120000, promo:null, dorsal:"7", c1:"#2b2b2b", c2:"#000000", sizes:["S","M","L","XL","XXL"], out:[]},
  {id:7, name:"Paris SG", sub:"Local 24/25", league:"Ligue 1", type:"Fan", price:78000, promo:65000, dorsal:"30", c1:"#14213d", c2:"#7a1220", sizes:["M","L","XL"], out:["S"]},
  {id:8, name:"Bayern", sub:"Local 24/25", league:"Bundesliga", type:"Player", price:120000, promo:null, dorsal:"9", c1:"#8a1420", c2:"#4a0810", sizes:["S","M","L","XL"], out:[]},
  {id:9, name:"Colombia", sub:"Local 2024", league:"Selecciones", type:"Fan", price:85000, promo:null, dorsal:"10", c1:"#c8a21a", c2:"#5a4410", sizes:["S","M","L","XL","XXL"], out:[]},
  {id:10, name:"Argentina", sub:"Campeón · Retro", league:"Selecciones", type:"Retro", price:95000, promo:null, dorsal:"10", c1:"#5aa0d6", c2:"#1e4a73", sizes:["M","L","XL"], out:["S"]},
  {id:11, name:"Milan", sub:"Retro 1990", league:"Serie A", type:"Retro", price:90000, promo:79000, dorsal:"3", c1:"#8a1420", c2:"#111111", sizes:["S","M","L"], out:["XL"]},
  {id:12, name:"Real Madrid", sub:"Uniforme completo", league:"LaLiga", type:"Uniforme completo", price:150000, promo:null, dorsal:"5", c1:"#3a4463", c2:"#141a2b", sizes:["S","M","L","XL"], out:[]},
  {id:13, name:"Boca Juniors", sub:"Retro 1981", league:"Otras ligas", type:"Retro", price:92000, promo:null, dorsal:"10", c1:"#0e2a5a", c2:"#c8a21a", sizes:["M","L","XL"], out:[]},
  {id:14, name:"Nacional", sub:"Uniforme completo", league:"Otras ligas", type:"Uniforme completo", price:145000, promo:null, dorsal:"9", c1:"#1f7a3a", c2:"#0d3a1c", sizes:["S","M","L","XL","XXL"], out:[]},
];
const jerseyIcon = t => t==="Player"?"i-player":t==="Uniforme completo"?"i-uniforme":t==="Retro"?"i-retro":"i-fan";
const patchIcon = t => t==="Player"?"i-p-player":t==="Retro"?"i-p-retro":t==="Fan"?"i-p-fan":"i-p-fan";

/* ---------- marquee ---------- */
const mqMsgs = ["Envios a todo el pais","Version Player y Fan","Camisetas Retro disponibles","Uniformes para tu equipo","Calidad de estadio","Personaliza con tu nombre"];
(function(){
  const track = document.getElementById("mqTrack");
  const build = () => mqMsgs.map(m=>`<span>${m}<i></i></span>`).join("");
  track.innerHTML = build()+build();
})();

/* ---------- filters state ---------- */
const state = { search:"", tipos:new Set(), ligas:new Set(), precio:new Set() };
const TIPOS = ["Player","Fan","Uniforme completo","Retro"];
const LIGAS = [...new Set(PRODUCTS.map(p=>p.league))];
const PRECIOS = [["0-79.999",0,79999],["80.000-119.999",80000,119999],["120.000+",120000,1e9]];

function countBy(fn){ return v => PRODUCTS.filter(p=>fn(p,v)).length; }

function renderFilterOptions(){
  const tipoBox=document.getElementById("fTipo");
  tipoBox.innerHTML=TIPOS.map(t=>`<label class="f-opt"><input type="checkbox" data-g="tipos" value="${t}"><span>${t}</span><span class="n">${PRODUCTS.filter(p=>p.type===t).length}</span></label>`).join("");
  const ligaBox=document.getElementById("fLiga");
  ligaBox.innerHTML=LIGAS.map(l=>`<label class="f-opt"><input type="checkbox" data-g="ligas" value="${l}"><span>${l}</span><span class="n">${PRODUCTS.filter(p=>p.league===l).length}</span></label>`).join("");
  const preBox=document.getElementById("fPrecio");
  preBox.innerHTML=PRECIOS.map((p,i)=>`<label class="f-opt"><input type="checkbox" data-g="precio" value="${i}"><span>$${p[0]}</span></label>`).join("");
  document.querySelectorAll('.f-opt input').forEach(cb=>{
    cb.addEventListener("change",()=>{
      const g=cb.dataset.g, v=g==="precio"?+cb.value:cb.value;
      cb.checked?state[g].add(v):state[g].delete(v);
      renderGrid();
    });
  });
}

function priceOf(p){ return p.promo ?? p.price; }
function matches(p){
  if(state.search){
    const s=state.search.toLowerCase();
    if(!(p.name.toLowerCase().includes(s)||p.league.toLowerCase().includes(s)||p.type.toLowerCase().includes(s)||p.sub.toLowerCase().includes(s))) return false;
  }
  if(state.tipos.size && !state.tipos.has(p.type)) return false;
  if(state.ligas.size && !state.ligas.has(p.league)) return false;
  if(state.precio.size){
    const pr=priceOf(p);
    const ok=[...state.precio].some(i=>pr>=PRECIOS[i][1]&&pr<=PRECIOS[i][2]);
    if(!ok) return false;
  }
  return true;
}

function renderGrid(){
  const grid=document.getElementById("grid");
  const list=PRODUCTS.filter(matches);
  document.getElementById("resCount").textContent=list.length;
  if(!list.length){
    grid.innerHTML=`<div class="empty"><svg class="ico"><use href="#i-fan"/></svg><h3>Sin resultados</h3><p>No encontramos camisetas con esos filtros. Prueba con otros o límpialos.</p><button class="btn btn-ink" onclick="clearAll()">Limpiar filtros</button></div>`;
    return;
  }
  grid.innerHTML=list.map(p=>{
    const promoTag = p.promo?`<div class="card-promo">-${Math.round((1-p.promo/p.price)*100)}%</div>`:"";
    const priceHtml = p.promo
      ? `<span class="now">${money(p.promo)}</span><span class="was">${money(p.price)}</span>`
      : `<span class="now">${money(p.price)}</span>`;
    return `<article class="card">
      <div class="card-img protect" style="background:linear-gradient(150deg,${p.c1},${p.c2})" oncontextmenu="return false" ondragstart="return false">
        <div class="card-dorsal">${p.dorsal}</div>
        <svg class="jersey ico"><use href="#${jerseyIcon(p.type)}"/></svg>
        <img class="card-patch" src="${PATCH_URI[p.type]||PATCH_URI['Fan']}" alt="" draggable="false">
        ${promoTag}
      </div>
      <div class="card-body">
        <span class="card-league">${p.league}</span>
        <h3 class="card-name">${p.name}</h3>
        <span class="card-sub">${p.sub} · ${p.type}</span>
        <div class="card-price">${priceHtml}</div>
        <button class="add-btn" data-add="${p.id}"><svg class="ico"><use href="#i-carrito"/></svg> Agregar</button>
      </div>
    </article>`;
  }).join("");
  bindCards();
}

/* patch data-uris (injected) */
const PATCH_URI = {"Player": "assets/patches/parche_player.svg", "Fan": "assets/patches/parche_fan.svg", "Retro": "assets/patches/parche_retro.svg", "Uniforme completo": "assets/patches/parche_fan.svg"};

function bindCards(){
  document.querySelectorAll('[data-add]').forEach(b=>{
    b.addEventListener("click",()=>openSizeModal(+b.dataset.add));
  });
}

/* ---------- cart ---------- */
let cart=[];
function addToCart(id, size){
  const p=PRODUCTS.find(x=>x.id===id);
  const key=id+"-"+size;
  const ex=cart.find(x=>x.key===key);
  if(ex) ex.qty++;
  else cart.push({key,id,name:p.name,sub:p.sub,type:p.type,size,price:priceOf(p),c1:p.c1,c2:p.c2,qty:1});
  updateCart();
  showToast(p.name+" agregada");
}
function updateCart(){
  const count=cart.reduce((a,c)=>a+c.qty,0);
  const total=cart.reduce((a,c)=>a+c.qty*c.price,0);
  document.getElementById("fabTotal").textContent=money(total);
  document.getElementById("fabBadge").textContent=count;
  document.getElementById("navCount").textContent=count;
  document.getElementById("navCount").classList.toggle("show",count>0);
  document.getElementById("cartFab").classList.toggle("show",count>0);
  document.getElementById("drawerTotal").textContent=money(total);
  const box=document.getElementById("drawerItems");
  const foot=document.getElementById("drawerFoot");
  if(!cart.length){
    box.innerHTML=`<div class="drawer-empty"><svg class="ico"><use href="#i-carrito"/></svg><h4>Tu pedido esta vacio</h4><p>Agrega camisetas y arma tu pedido. Cierras la compra por WhatsApp.</p></div>`;
    foot.style.display="none";
    return;
  }
  foot.style.display="block";
  box.innerHTML=cart.map(c=>`<div class="d-item">
    <div class="d-thumb" style="background:linear-gradient(150deg,${c.c1},${c.c2})"><svg class="jersey ico"><use href="#${jerseyIcon(c.type)}"/></svg></div>
    <div class="d-info">
      <div class="nm">${c.name}</div>
      <div class="meta">${c.type}${c.size?` · Talla <b>${c.size}</b>`:""}</div>
      <div class="qty">
        <button data-dec="${c.key}" aria-label="Quitar uno">−</button>
        <span>${c.qty}</span>
        <button data-inc="${c.key}" aria-label="Agregar uno">+</button>
      </div>
    </div>
    <div class="d-right">
      <div class="d-price">${money(c.qty*c.price)}</div>
      <button class="d-remove" data-rm="${c.key}">Quitar</button>
    </div>
  </div>`).join("");
  box.querySelectorAll('[data-inc]').forEach(b=>b.onclick=()=>{cart.find(x=>x.key===b.dataset.inc).qty++;updateCart();});
  box.querySelectorAll('[data-dec]').forEach(b=>b.onclick=()=>{const it=cart.find(x=>x.key===b.dataset.dec);it.qty--;if(it.qty<=0)cart=cart.filter(x=>x.key!==it.key);updateCart();});
  box.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.key!==b.dataset.rm);updateCart();});
}
function waOrderLink(){
  if(!cart.length) return "https://wa.me/"+WA_NUMBER;
  let msg="¡Hola Tropigol! Quiero hacer este pedido:%0A%0A";
  cart.forEach(c=>{ msg+=`• ${c.qty}x ${c.name} (${c.type}${c.size?`, talla ${c.size}`:""}) — ${money(c.qty*c.price)}%0A`; });
  const total=cart.reduce((a,c)=>a+c.qty*c.price,0);
  msg+=`%0A*Total: ${money(total)}*%0A%0A¿Me confirmas disponibilidad y forma de pago?`;
  return "https://wa.me/"+WA_NUMBER+"?text="+msg;
}

/* ---------- toast ---------- */
let toastT;
function showToast(msg){
  const t=document.getElementById("toast");
  document.getElementById("toastMsg").textContent=msg;
  t.classList.add("show");
  clearTimeout(toastT);
  toastT=setTimeout(()=>t.classList.remove("show"),3200);
}
document.getElementById("toastView").onclick=openDrawer;

/* ---------- drawer ---------- */
function openDrawer(){document.getElementById("drawer").classList.add("open");document.getElementById("drawerBg").classList.add("open");}
function closeDrawer(){document.getElementById("drawer").classList.remove("open");document.getElementById("drawerBg").classList.remove("open");}
document.getElementById("cartFab").onclick=openDrawer;
document.getElementById("openCart").onclick=openDrawer;
document.getElementById("closeDrawer").onclick=closeDrawer;
document.getElementById("drawerBg").onclick=closeDrawer;
document.getElementById("waOrder").onclick=()=>window.open(waOrderLink(),"_blank");

/* ---------- size modal ---------- */
let smState={id:null,size:null};
function openSizeModal(id){
  const p=PRODUCTS.find(x=>x.id===id);
  smState={id,size:null};
  const photo=document.getElementById("smPhoto");
  photo.style.background=`linear-gradient(150deg,${p.c1},${p.c2})`;
  photo.innerHTML=`<div class="card-dorsal">${p.dorsal}</div><svg class="jersey ico"><use href="#${jerseyIcon(p.type)}"/></svg><img class="card-patch" src="${PATCH_URI[p.type]||PATCH_URI['Fan']}" alt="" draggable="false">`;
  document.getElementById("smLeague").textContent=p.league;
  document.getElementById("smName").textContent=p.name;
  document.getElementById("smSub").textContent=`${p.sub} · ${p.type}`;
  document.getElementById("smPrice").innerHTML=p.promo
    ?`<span class="now">${money(p.promo)}</span><span class="was">${money(p.price)}</span>`
    :`<span class="now">${money(p.price)}</span>`;
  document.getElementById("smSizes").innerHTML=["S","M","L","XL","XXL"].map(s=>
    p.sizes.includes(s)?`<button class="size" data-s="${s}">${s}</button>`:`<span class="size out" title="Agotada">${s}</span>`
  ).join("");
  document.getElementById("smHint").textContent="";
  document.querySelectorAll("#smSizes .size:not(.out)").forEach(b=>{
    b.onclick=()=>{
      smState.size=b.dataset.s;
      document.querySelectorAll("#smSizes .size").forEach(x=>x.classList.remove("sel"));
      b.classList.add("sel");
      document.getElementById("smHint").textContent="";
    };
  });
  document.getElementById("sizeModal").classList.add("open");
}
function closeSize(){document.getElementById("sizeModal").classList.remove("open");}
document.getElementById("closeSize").onclick=closeSize;
document.getElementById("sizeModal").onclick=e=>{if(e.target.id==="sizeModal")closeSize();};
document.getElementById("smAdd").onclick=()=>{
  if(!smState.size){document.getElementById("smHint").textContent="Elige una talla para continuar";return;}
  addToCart(smState.id,smState.size);
  closeSize();
};

/* ---------- versus modal ---------- */
function openVersus(){document.getElementById("versusModal").classList.add("open");}
function closeVersus(){document.getElementById("versusModal").classList.remove("open");}
document.getElementById("openVersus").onclick=openVersus;
document.getElementById("closeVersus").onclick=closeVersus;
document.getElementById("versusModal").onclick=e=>{if(e.target.id==="versusModal")closeVersus();};

/* ---------- search / filter toggles ---------- */
document.getElementById("searchInput").addEventListener("input",e=>{state.search=e.target.value;renderGrid();});
document.getElementById("clearFilters").onclick=clearAll;
function clearAll(){
  state.search="";state.tipos.clear();state.ligas.clear();state.precio.clear();
  document.querySelectorAll('.f-opt input').forEach(c=>c.checked=false);
  document.getElementById("searchInput").value="";
  renderGrid();
}
document.getElementById("searchJump").onclick=()=>{document.getElementById("catalogo").scrollIntoView();setTimeout(()=>document.getElementById("searchInput").focus(),500);};
document.getElementById("mobileFilterBtn").onclick=()=>document.getElementById("filters").classList.add("open");
const mobileNav=document.getElementById("mobileNav");
document.getElementById("menuBtn").onclick=()=>{const o=mobileNav.classList.toggle("open");document.getElementById("menuBtn").setAttribute("aria-expanded",o);};
mobileNav.querySelectorAll("a").forEach(a=>a.onclick=()=>mobileNav.classList.remove("open"));

/* tipo cards + footer links -> filter */
document.querySelectorAll('[data-tipo]').forEach(el=>{
  el.addEventListener("click",e=>{
    const t=el.dataset.tipo;
    clearAll();
    state.tipos.add(t);
    document.querySelectorAll(`.f-opt input[data-g="tipos"][value="${t}"]`).forEach(c=>c.checked=true);
    renderGrid();
    document.getElementById("catalogo").scrollIntoView();
  });
});

/* team + footer whatsapp */
document.getElementById("teamQuote").onclick=()=>window.open("https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent("¡Hola Tropigol! Quiero cotizar uniformes para mi equipo completo."),"_blank");
document.getElementById("footWa").onclick=()=>window.open("https://wa.me/"+WA_NUMBER,"_blank");
document.getElementById("footWa").style.cursor="pointer";

/* close filters drawer on outside tap (mobile) */
document.addEventListener("click",e=>{
  const f=document.getElementById("filters");
  if(window.innerWidth<=1080 && f.classList.contains("open") && !f.contains(e.target) && e.target.id!=="mobileFilterBtn" && !e.target.closest("#mobileFilterBtn")) f.classList.remove("open");
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeDrawer();closeVersus();closeSize();document.getElementById("filters").classList.remove("open");}});

/* block right-click on protected imagery */
document.addEventListener("contextmenu",e=>{if(e.target.closest(".protect"))e.preventDefault();});

document.getElementById("year").textContent=new Date().getFullYear();

/* init */
renderFilterOptions();
renderGrid();
updateCart();
