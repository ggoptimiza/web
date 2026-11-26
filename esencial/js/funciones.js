/* Lógica funcional de GGOptimiza (calendario, reporte, contacto, asistente). Copia fiel del archivo de referencia, sin cambios. */
(function(){
"use strict";
/* ---- Datos de contacto y redes (completa las redes antes de publicar) ---- */
var CONTACTO={correo:"global@ggoptimiza.com",whatsapp:"593963545517",whatsappVisible:"0963 545 517"};
var REDES=[
  {id:"tiktok",nombre:"TikTok",url:""},
  {id:"instagram",nombre:"Instagram",url:""},
  {id:"facebook",nombre:"Facebook",url:""}
];
var ICONOS={
  tiktok:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.2a3.2 3.2 0 1 1-3.2-3.2" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M14 3c.4 2.6 2 4.2 5 4.4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
  instagram:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="17" cy="7" r="1.3" fill="currentColor"/></svg>',
  facebook:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M13.2 20v-7h2.4l.4-2.8h-2.8V8.6c0-.8.3-1.3 1.4-1.3H16V5a15 15 0 0 0-2-.1c-2.1 0-3.5 1.3-3.5 3.6v1.7H8.2V13h2.3v7" fill="currentColor"/></svg>'
};
function wa(texto){return "https://wa.me/"+CONTACTO.whatsapp+"?text="+encodeURIComponent(texto)}
var MSJ_SUSCRIBIR="Hola, quiero suscribirme a GGOptimiza por $5 al mes.";

var NS="http://www.w3.org/2000/svg";
var MESES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
var INICIAL=["E","F","M","A","M","J","J","A","S","O","N","D"];
var DIA_POR_DIGITO={1:10,2:12,3:14,4:16,5:18,6:20,7:22,8:24,9:26,0:28};
var CASOS=[
  {id:"mensual",nombre:"IVA mensual",renta:2,semestral:false},
  {id:"semestral",nombre:"IVA semestral",renta:2,semestral:true},
  {id:"sociedad",nombre:"Sociedad",renta:3,semestral:false}
];
var estado={digito:4,caso:"mensual"};
function el(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function fecha(y,m,d){return new Date(y,m,d)}
function hoy(){var h=new Date();return fecha(h.getFullYear(),h.getMonth(),h.getDate())}
function texto(d){return d.getDate()+" de "+MESES[d.getMonth()]}
function dias(a,b){return Math.round((b-a)/86400000)}

/* Controles de fecha */
(function(){
  var cd=document.getElementById("digitos");
  [1,2,3,4,5,6,7,8,9,0].forEach(function(n){
    var l=document.createElement("label");
    l.innerHTML='<input type="radio" name="digito" value="'+n+'"'+(n===estado.digito?" checked":"")+' aria-label="Noveno dígito '+n+'"><span>'+n+'</span>';
    cd.appendChild(l);
  });
  var cc=document.getElementById("casos");
  CASOS.forEach(function(c){
    var l=document.createElement("label");
    l.innerHTML='<input type="radio" name="caso" value="'+c.id+'"'+(c.id===estado.caso?" checked":"")+'><span>'+c.nombre+'</span>';
    cc.appendChild(l);
  });
  document.querySelectorAll("input[name=digito]").forEach(function(i){i.addEventListener("change",function(){estado.digito=+i.value;pintar(true)})});
  document.querySelectorAll("input[name=caso]").forEach(function(i){i.addEventListener("change",function(){estado.caso=i.value;pintar(true)})});
})();
function fijarDigito(n){
  estado.digito=n;
  var i=document.querySelector("input[name=digito][value='"+n+"']"); if(i)i.checked=true;
  pintar(true);
}
/* Vencimientos del cliente para un año */
function eventos(y){
  var c=CASOS.filter(function(x){return x.id===estado.caso})[0], dia=DIA_POR_DIGITO[estado.digito], out=[];
  if(c.semestral){
    out.push({f:fecha(y,0,dia),tipo:"IVA",detalle:"IVA de julio a diciembre de "+(y-1)});
    out.push({f:fecha(y,6,dia),tipo:"IVA",detalle:"IVA de enero a junio"});
  }else{
    for(var m=0;m<12;m++){
      var p=m===0?"diciembre":MESES[m-1];
      out.push({f:fecha(y,m,dia),tipo:"IVA",detalle:"IVA de "+p+(m===0?" de "+(y-1):"")});
    }
  }
  out.push({f:fecha(y,c.renta,dia),tipo:"Renta",detalle:"Impuesto a la renta de "+(y-1)});
  return out.sort(function(a,b){return a.f-b.f});
}
function proximo(){
  var h=hoy(), y=h.getFullYear(), todos=eventos(y).concat(eventos(y+1));
  for(var i=0;i<todos.length;i++){if(todos[i].f>=h)return todos[i]}
  return todos[0];
}

/* Anillos entrelazados */
var R=140,GROSOR=24,C1={x:175,y:180},C2={x:395,y:180};
function pos(c,i,n,r){var a=(-90+360*i/n)*Math.PI/180;return {x:c.x+(r||R)*Math.cos(a),y:c.y+(r||R)*Math.sin(a)}}

function anillo1(g,ev,animar){
  var f=ev.f, n=new Date(f.getFullYear(),f.getMonth()+1,0).getDate(), h=hoy(), dia=f.getDate();
  el("circle",{cx:C1.x,cy:C1.y,r:R,fill:"none",stroke:"url(#grad)","stroke-width":GROSOR},g);
  for(var d=1;d<=n;d++){
    var p=pos(C1,d-1,n), esVence=d===dia, esAntes=(d===dia-5||d===dia-2), esHoy=(h.getFullYear()===f.getFullYear()&&h.getMonth()===f.getMonth()&&h.getDate()===d);
    var c=el("circle",{cx:p.x,cy:p.y,r:esVence?14:esAntes?6.5:3.6,fill:esVence?"#56c5cf":esAntes?"#30568e":"#9db8c0"},g);
    if(animar)c.setAttribute("class","pop"),c.style.animationDelay=(d*12)+"ms";
    if(esVence){var t=el("text",{x:p.x,y:p.y+5,"text-anchor":"middle","font-size":"14","font-weight":"800",fill:"#072a35","font-family":"Bricolage Grotesque,sans-serif"},g);t.textContent=d}
    if(esHoy){el("circle",{cx:p.x,cy:p.y,r:esVence?19:9,fill:"none",stroke:"#f7c948","stroke-width":"3.5"},g)}
  }
  var t1=el("text",{x:C1.x,y:C1.y+4,"text-anchor":"middle","font-size":"58","font-weight":"800",fill:"#072a35","font-family":"Bricolage Grotesque,sans-serif"},g);t1.textContent=dia;
  var t2=el("text",{x:C1.x,y:C1.y+34,"text-anchor":"middle","font-size":"17","font-weight":"700",fill:"#566872","font-family":"Nunito Sans,sans-serif"},g);t2.textContent=MESES[f.getMonth()];
  var t3=el("text",{x:C1.x,y:C1.y-48,"text-anchor":"middle","font-size":"14","font-weight":"700",fill:"#30568e","font-family":"Nunito Sans,sans-serif"},g);t3.textContent=ev.tipo==="IVA"?"vence tu IVA":"vence tu renta";
}
function anillo2(g,ev,animar){
  var y=ev.f.getFullYear(), lista=eventos(y), h=hoy();
  el("circle",{cx:C2.x,cy:C2.y,r:R,fill:"none",stroke:"url(#grad)","stroke-width":GROSOR},g);
  for(var m=0;m<12;m++){
    var p=pos(C2,m,12), es=lista.filter(function(e){return e.f.getMonth()===m}), iva=es.some(function(e){return e.tipo==="IVA"}), renta=es.some(function(e){return e.tipo==="Renta"});
    var esProx=es.some(function(e){return e.f.getTime()===ev.f.getTime()});
    var col=renta?"#4c43a8":iva?"#30568e":"#ffffff", r=es.length?(esProx?15:12):9;
    var c=el("circle",{cx:p.x,cy:p.y,r:r,fill:col,stroke:es.length?"none":"#9db8c0","stroke-width":2},g);
    if(animar)c.setAttribute("class","pop"),c.style.animationDelay=(m*40)+"ms";
    if(esProx)el("circle",{cx:p.x,cy:p.y,r:r+5,fill:"none",stroke:"#f7c948","stroke-width":"3.5"},g);
    var t=el("text",{x:p.x,y:p.y+4,"text-anchor":"middle","font-size":es.length?"12":"10","font-weight":"800",fill:es.length?"#fff":"#566872","font-family":"Nunito Sans,sans-serif"},g);t.textContent=INICIAL[m];
  }
  var a=el("text",{x:C2.x,y:C2.y+4,"text-anchor":"middle","font-size":"58","font-weight":"800",fill:"#072a35","font-family":"Bricolage Grotesque,sans-serif"},g);a.textContent=y;
  var b=el("text",{x:C2.x,y:C2.y+34,"text-anchor":"middle","font-size":"17","font-weight":"700",fill:"#566872","font-family":"Nunito Sans,sans-serif"},g);b.textContent="tu año";
}
function pintar(animar){
  var svg=document.getElementById("anillos"), ev=proximo(), h=hoy();
  Array.prototype.slice.call(svg.childNodes).forEach(function(n){if(n.nodeName!=="title")svg.removeChild(n)});
  var defs=el("defs",{},svg), gr=el("linearGradient",{id:"grad",x1:"0",y1:"0",x2:"1",y2:"1"},defs);
  el("stop",{offset:"0","stop-color":"#b4c8e4"},gr);el("stop",{offset:"1","stop-color":"#b9e8ee"},gr);
  var cp=el("clipPath",{id:"mitad"},defs);el("rect",{x:C2.x-R-GROSOR,y:C1.y,width:C1.x+R-(C2.x-R)+2*GROSOR,height:200},cp);
  var g1=el("g",{id:"r1"},svg), g2=el("g",{},svg);
  anillo1(g1,ev,animar);anillo2(g2,ev,animar);
  /* el anillo del mes pasa por encima en el cruce de abajo, como los aros del logo */
  var enc=el("g",{"clip-path":"url(#mitad)"},svg);
  var u=el("use",{},enc);u.setAttributeNS("http://www.w3.org/1999/xlink","href","#r1");u.setAttribute("href","#r1");
  var faltan=dias(h,ev.f), c=CASOS.filter(function(x){return x.id===estado.caso})[0];
  var cuando=faltan===0?"Es hoy":faltan===1?"Falta 1 día":"Faltan "+faltan+" días";
  var ant1=new Date(ev.f.getFullYear(),ev.f.getMonth(),ev.f.getDate()-5), ant2=new Date(ev.f.getFullYear(),ev.f.getMonth(),ev.f.getDate()-2);
  var pasos=ev.tipo==="IVA"
   ?'<li><b>Antes</b><span>Subes el listado del SRI y el sistema baja cada comprobante.</span></li><li><b>'+texto(ant1)+'</b><span>Tu IVA queda calculado casillero por casillero.</span></li><li><b>'+texto(ant2)+'</b><span>Te avisamos en el celular o por correo para que lo presentes.</span></li>'
   :'<li><b>Antes</b><span>Tus comprobantes emitidos y recibidos del año ya están ordenados por mes.</span></li><li><b>'+texto(ant1)+'</b><span>Descargas el detalle de ingresos para tu declaración.</span></li><li><b>'+texto(ant2)+'</b><span>Te avisamos para que la presentes a tiempo.</span></li>';
  document.getElementById("proximo").innerHTML='<span class="pista">Tu próximo vencimiento, con el noveno dígito '+estado.digito+'</span><strong>'+ev.detalle+': '+texto(ev.f)+' de '+ev.f.getFullYear()+'</strong><span class="dias">'+cuando+'</span><ul class="pasos">'+pasos+'</ul><span class="aviso">Si la fecha cae en fin de semana o feriado, pasa al siguiente día hábil.</span>';
  document.getElementById("leyenda").innerHTML='<span><i style="background:#56c5cf"></i>Vencimiento</span><span><i style="background:#30568e"></i>Pasos previos</span><span><i style="background:#4c43a8"></i>Renta</span><span><i style="background:#fff;border:3px solid #f7c948;width:12px;height:12px"></i>Hoy y próximo</span>';
}

pintar(false);
/* Tablero de ejemplo */
(function(){
  var ing=[8420,9150,10380,9760,11200,10840,12150,11930,12760,13420,12980,14510];
  var egr=[6120,6480,7010,6890,7640,7390,8120,8050,8460,8890,8610,9320];
  var W=720,H=260,base=214,tope=24,max=16000,izq=44,paso=(W-izq)/12;
  var svg=document.getElementById("barras"), lect=document.getElementById("lectura");
  function fmt(n){return "$ "+n.toLocaleString("es-EC",{minimumFractionDigits:2,maximumFractionDigits:2})}
  function y(v){return base-(v/max)*(base-tope)}
  [0,4000,8000,12000,16000].forEach(function(v){
    el("line",{x1:izq-6,x2:W,y1:y(v),y2:y(v),stroke:"#d6e3e6","stroke-width":1},svg);
    var t=el("text",{x:2,y:y(v)-4,"font-size":"11",fill:"#566872","font-family":"Nunito Sans,sans-serif"},svg);t.textContent=v===0?"0":(v/1000)+" mil";
  });
  var sum=function(a){return a.reduce(function(s,v){return s+v},0)}, TI=sum(ing), TE=sum(egr);
  document.getElementById("kpis").innerHTML='<div class="kpi i"><small>Ingresos del año</small><b>'+fmt(TI)+'</b></div><div class="kpi e"><small>Egresos del año</small><b>'+fmt(TE)+'</b></div><div class="kpi r"><small>Resultado</small><b>'+fmt(TI-TE)+'</b></div>';
  function leer(m){lect.textContent=MESES[m].charAt(0).toUpperCase()+MESES[m].slice(1)+": ingresos "+fmt(ing[m])+" · egresos "+fmt(egr[m])+" · resultado "+fmt(ing[m]-egr[m])}
  for(var m=0;m<12;m++){(function(m){
    var g=el("g",{"class":"mes",tabindex:"0",role:"img","aria-label":MESES[m]+": ingresos "+fmt(ing[m])+", egresos "+fmt(egr[m])},svg);
    el("rect",{"class":"fondo",x:izq+m*paso+2,y:6,width:paso-4,height:base-6+30,rx:10,fill:"transparent"},g);
    el("rect",{x:izq+m*paso+paso*.18,y:y(ing[m]),width:paso*.30,height:base-y(ing[m]),rx:4,fill:"#56c5cf"},g);
    el("rect",{x:izq+m*paso+paso*.52,y:y(egr[m]),width:paso*.30,height:base-y(egr[m]),rx:4,fill:"#30568e"},g);
    var t=el("text",{x:izq+m*paso+paso/2,y:base+20,"text-anchor":"middle","font-size":"12","font-weight":"700",fill:"#566872","font-family":"Nunito Sans,sans-serif"},g);t.textContent=MESES[m].slice(0,3);
    g.addEventListener("mouseenter",function(){leer(m)});g.addEventListener("focus",function(){leer(m)});g.addEventListener("click",function(){leer(m)});
  })(m)}
  leer(11);
})();



/* Redes */
(function(){
  var c=document.getElementById("redes");
  REDES.forEach(function(r){
    var e;
    if(r.url){e=document.createElement("a");e.href=r.url;e.target="_blank";e.rel="noopener";e.className="red";e.innerHTML=ICONOS[r.id]+r.nombre}
    else{e=document.createElement("span");e.className="red pronto";e.innerHTML=ICONOS[r.id]+r.nombre+" <small>pronto</small>"}
    c.appendChild(e);
  });
})();

/* Suscripción y contacto: todo termina en WhatsApp o correo, nada se envía solo */
(function(){
  document.getElementById("suscribir").href=wa(MSJ_SUSCRIBIR);
  document.getElementById("suscribir").target="_blank";document.getElementById("suscribir").rel="noopener";
  if(!document.getElementById("formulario"))return;
  var d=document.getElementById("wa-directo");d.href=wa("Hola, quiero información de GGOptimiza.");d.target="_blank";d.rel="noopener";
  document.getElementById("dato-wa").innerHTML='WhatsApp <small>'+CONTACTO.whatsappVisible+' · solo mensajes por WhatsApp</small>';
  document.getElementById("dato-correo").innerHTML='Correo <small>'+CONTACTO.correo+'</small>';
  var f=document.getElementById("formulario"), res=document.getElementById("resultado");
  f.addEventListener("submit",function(e){
    e.preventDefault();
    var n=document.getElementById("f-nombre").value.trim(), neg=document.getElementById("f-negocio").value.trim(), m=document.getElementById("f-mensaje").value.trim();
    var t="Hola, soy "+(n||"(tu nombre)")+".\n"+(neg?"Mi negocio: "+neg+".\n":"")+(m?m+"\n":"")+"\nGracias.";
    document.getElementById("f-texto").value=t;
    var w=document.getElementById("f-wa");w.href=wa(t);w.target="_blank";w.rel="noopener";
    document.getElementById("f-correo").href="mailto:"+CONTACTO.correo+"?subject="+encodeURIComponent("Consulta desde la página web")+"&body="+encodeURIComponent(t);
    document.getElementById("f-nota").textContent="Si no se abre tu correo, copia el mensaje y escríbenos a "+CONTACTO.correo+".";
    res.classList.add("on");
  });
  document.getElementById("f-copiar").addEventListener("click",function(){
    var ta=document.getElementById("f-texto"), b=this;
    try{navigator.clipboard.writeText(ta.value).then(function(){b.textContent="Copiado"},function(){ta.select()})}catch(x){ta.select()}
  });
})();

/* ---- Asistente ---- */
(function(){
  var chat=document.getElementById("chat"), lista=document.getElementById("mensajes"), ent=document.getElementById("chat-entrada"), lanz=document.getElementById("lanzador");
  function agregar(t,quien,html){
    var d=document.createElement("div");d.className="msg "+quien;
    if(html)d.innerHTML=t;else d.textContent=t;
    lista.appendChild(d);lista.scrollTop=lista.scrollHeight;return d;
  }
  function abrir(){
    chat.classList.add("on");lanz.setAttribute("aria-expanded","true");
    if(!lista.children.length){
      agregar("Hola, soy el asistente de GGOptimiza. Te cuento qué incluye el plan de $5 al mes, te ayudo con fechas del SRI o reviso si tu RUC está bien escrito. ¿Qué necesitas?","ia");
      sug();
    }
    ent.focus();
  }
  function cerrar(){chat.classList.remove("on");lanz.setAttribute("aria-expanded","false");lanz.focus()}
  document.querySelectorAll("[data-abrir-chat]").forEach(function(b){b.addEventListener("click",abrir)});
  document.getElementById("cerrar-chat").addEventListener("click",cerrar);
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&chat.classList.contains("on"))cerrar()});

  var PREGUNTAS=["¿Qué incluye el plan?","¿Cuánto cuesta?","¿Es seguro?","¿Cuándo vence mi IVA?","¿Cómo me suscribo?"];
  function sug(){
    var c=document.getElementById("sugeridas");c.innerHTML="";
    PREGUNTAS.forEach(function(p){var b=document.createElement("button");b.type="button";b.textContent=p;b.addEventListener("click",function(){preguntar(p)});c.appendChild(b)});
  }

  /* Validación de cédula y RUC ecuatorianos (algoritmos oficiales de dígito verificador) */
  function mod10(c){var s=0;for(var i=0;i<9;i++){var v=+c[i]*(i%2===0?2:1);if(v>9)v-=9;s+=v}return (10-s%10)%10===+c[9]}
  function mod11(c,coef,pos){var s=0;for(var i=0;i<coef.length;i++)s+=+c[i]*coef[i];var r=11-s%11;if(r===11)r=0;return r===+c[pos]}
  function revisarRuc(t){
    var n=t.replace(/\D/g,"");
    if(n.length!==10&&n.length!==13)return null;
    var prov=+n.slice(0,2); if(prov<1||prov>24&&prov!==30)return {ok:false,msg:"Los dos primeros dígitos no corresponden a una provincia."};
    var tercero=+n[2], ok=false, tipo="";
    if(n.length===10){ok=tercero<6&&mod10(n);tipo="cédula"}
    else{
      if(n.slice(10)==="000")return {ok:false,msg:"Un RUC termina en 001 o más, no en 000."};
      if(tercero<6){ok=mod10(n);tipo="RUC de persona natural"}
      else if(tercero===9){ok=mod11(n,[4,3,2,7,6,5,4,3,2],9);tipo="RUC de sociedad privada"}
      else if(tercero===6){ok=mod11(n,[3,2,7,6,5,4,3,2],8);tipo="RUC de entidad pública"}
      else return {ok:false,msg:"El tercer dígito no corresponde a un tipo de RUC."};
    }
    return ok?{ok:true,tipo:tipo,noveno:+n[8],n:n}:{ok:false,msg:"El dígito verificador no coincide. Revisa si falta o sobra algún número."};
  }
  function vence(d){return DIA_POR_DIGITO[d]}

  var base=[
    {k:/(incluye|incluy|que hace|qué hace|ofrece|sirve|funciones)/,r:"Por $5 al mes tienes:\n• Plataforma segura con tus datos separados de los de otras empresas\n• Emisión de tus comprobantes de venta (hoy en piloto)\n• Recuperación de tus comprobantes del SRI\n• Tu declaración de IVA armada\n• Recordatorios y ayuda para presentarla\n• Un reporte dinámico de cómo va tu negocio\n• Este asistente con IA"},
    {k:/(precio|cuesta|cuánto|cuanto|valor|pago|pagar|tarifa|mensual)/,r:"El plan cuesta $5 al mes e incluye todo lo que ves en la sección de precio. Para suscribirte te abrimos WhatsApp con tu solicitud ya escrita."},
    {k:/(segur|datos|privacid|clave|protege|confian)/,r:"Cada empresa trabaja con sus datos separados de las demás. El ingreso lleva verificación de tu correo y segunda clave, y tus claves del SRI se guardan cifradas. Nadie ve tu información sin permiso."},
    {k:/(suscrib|afili|contrat|inscrib|registr|empezar|comenzar|quiero)/,r:"Para suscribirte toca el botón y te abrimos WhatsApp con el mensaje listo.",btn:true},
    {k:/(emit|factur|comprobante de venta|nota de cr)/,r:"Desde la plataforma puedes emitir facturas y notas de crédito firmadas con tu certificado y enviadas al SRI. Esta función está en piloto: pregúntanos por WhatsApp cuándo se activa en tu cuenta."},
    {k:/(recupera|descarga|descargar|bajar|comprobantes del sri|compras)/,r:"Recuperamos tus comprobantes del SRI, recibidos y emitidos, y los ordenamos por mes con el detalle de cada uno. Con eso se calculan tu IVA y tu reporte."},
    {k:/(declaraci|104|iva)/,r:"Armamos tu declaración de IVA casillero por casillero a partir de tus comprobantes. Tú la revisas y la presentas en el portal del SRI con tu clave. Si me dices tu RUC o el noveno dígito, te digo cuándo vence."},
    {k:/(recuerd|aviso|notific|alerta|fecha)/,r:"Te enviamos un aviso al celular o al correo antes de cada vencimiento, con lo que falta hacer. Escribe tu RUC y te digo tu fecha."},
    {k:/(reporte|tablero|negocio|ingresos|egresos|como voy|cómo voy)/,r:"Tu reporte muestra ingresos, egresos y resultado mes a mes, lo que te deben y tus principales clientes y proveedores. Se actualiza solo con tus comprobantes. Míralo en la sección «Tu negocio de un vistazo»."},
    {k:/(sri|base de datos|bdd|consulta)/,r:"Trabajamos con la información que el SRI publica y con tus comprobantes autorizados. Aquí no consulto los datos de tu RUC; sí puedo revisar que esté bien escrito y decirte cuándo vence tu IVA."},
    {k:/(whatsapp|contacto|celular|llamar|correo|escribir|hablar)/,r:"Escríbenos por WhatsApp al "+"0963 545 517 (solo mensajes) o al correo "+"global@ggoptimiza.com.",wa:true},
    {k:/(hola|buenas|buenos|saludos)/,r:"¡Hola! ¿Quieres saber qué incluye el plan, cuánto cuesta o cuándo vence tu IVA?"},
    {k:/(gracias|listo|ok)/,r:"Con gusto. Si quieres suscribirte, el botón de WhatsApp te lleva directo."}
  ];

  function responderRuc(r){
    if(!r.ok){return "Revisé ese número y no parece válido. "+r.msg}
    var d=r.noveno, dia=vence(d), c=CASOS.filter(function(x){return x.id===estado.caso})[0];
    fijarDigito(d);
    var ev=proximo(), faltan=dias(hoy(),ev.f);
    return "Es un "+r.tipo+" bien escrito. Su noveno dígito es "+d+": tu IVA vence el día "+dia+" de cada mes (si cae en fin de semana o feriado, pasa al siguiente día hábil).\nTu próximo vencimiento: "+ev.detalle+", el "+texto(ev.f)+" de "+ev.f.getFullYear()+(faltan>=0?" ("+(faltan===0?"es hoy":"faltan "+faltan+" días")+")":"")+".\nYa lo marqué en el calendario de arriba. No guardé tu número.";
  }
  function responder(q){
    var r=revisarRuc(q); if(r)return {t:responderRuc(r)};
    var m=q.match(/noveno.{0,12}?(\d)/i); if(m){fijarDigito(+m[1]);return {t:"Con el noveno dígito "+m[1]+", tu IVA vence el día "+vence(+m[1])+" de cada mes. Lo marqué en el calendario de arriba."}}
    var s=q.toLowerCase();
    if(/(vence|cuándo|cuando)/.test(s)&&/(iva|declaraci|renta|impuesto)/.test(s))return {t:"Escribe tu RUC o el noveno dígito y te digo la fecha. Por ejemplo: «noveno dígito 4»."};
    for(var i=0;i<base.length;i++){if(base[i].k.test(s))return {t:base[i].r,btn:base[i].btn,wa:base[i].wa}}
    return {t:"Todavía no tengo esa respuesta. Puedes escribirnos por WhatsApp y te contestamos.",wa:true};
  }
  function preguntar(q){
    q=q.trim();if(!q)return;
    agregar(q,"yo");
    var r=responder(q), d=agregar(r.t,"ia");
    if(r.btn||r.wa){
      var a=document.createElement("a");a.className="boton";a.style.marginTop="8px";a.style.display="inline-flex";a.target="_blank";a.rel="noopener";
      a.href=wa(r.btn?MSJ_SUSCRIBIR:"Hola, tengo una consulta sobre GGOptimiza.");a.textContent=r.btn?"Suscribirme por WhatsApp":"Abrir WhatsApp";
      var w=document.createElement("div");w.appendChild(a);d.appendChild(w);
    }
    lista.scrollTop=lista.scrollHeight;
  }
  document.getElementById("chat-form").addEventListener("submit",function(e){e.preventDefault();var v=ent.value;ent.value="";preguntar(v)});
})();
})();
