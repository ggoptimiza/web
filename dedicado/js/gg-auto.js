/* GG Optimiza · recorrido automático lento (como avanzar con el mouse, sin saltos) + memoria de escena al volver.
   Uso: <script src="js/gg-auto.js"></script> ANTES del script 3D; luego GGAuto.init({...}) (se llama solo con data-* del <script> o manualmente). */
(function(){
  var D=document,R=D.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,KEY='gg_retorno';
  var cfg=window.GG_AUTO||{};
  function irAhora(y){window.scrollTo({top:y,left:0,behavior:'instant'})}
  /* ---- 1) antes de que arranque la escena: volver a donde estaba, o ir al contacto ---- */
  var sinAuto=false;
  try{if('scrollRestoration' in history)history.scrollRestoration='manual'}catch(_){}
  if(cfg.raiz){
    try{
      var g=sessionStorage.getItem(KEY);
      if(location.hash==='#contacto'){sinAuto=true;sessionStorage.removeItem(KEY);irAhora(1e6)}
      else if(g!==null){sinAuto=true;sessionStorage.removeItem(KEY);irAhora(+g||0)}
    }catch(_){}
    D.addEventListener('click',function(e){
      var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
      if(/(esencial|empresarial|dedicado)\/index\.html/.test(a.getAttribute('href')||a.href)||/(esencial|empresarial|dedicado)\/index\.html$/.test(a.href)){
        try{var y=Math.round(window.scrollY),A=(window.GG3D&&window.GG3D.anclas)||[],m=y,dm=300;A.forEach(function(v){if(Math.abs(v-y)<dm){dm=Math.abs(v-y);m=Math.round(v)}});sessionStorage.setItem(KEY,String(m))}catch(_){}
      }
    },true);
  }
  /* ---- 2) recorrido automático ---- */
  function iniciar(){
    if(reduce)return;
    var activo=false,raf=0,seg=null,espera=0,tPrev=0,ultY=-1,mov=0,mx=null,my=null,fin=false,lim=cfg.parar,tope=false;
    var css=D.createElement('style');
    css.textContent='.gg-auto{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:70;display:inline-flex;gap:9px;align-items:center;padding:9px 16px;border-radius:999px;border:1px solid rgba(255,255,255,.3);background:rgba(10,20,40,.72);color:#fff;font:600 12px/1 system-ui,sans-serif;letter-spacing:.05em;cursor:pointer;backdrop-filter:blur(8px)}.gg-auto:hover{background:rgba(10,20,40,.92)}.gg-auto i{width:8px;height:8px;border-radius:50%;background:#2fd4a8;box-shadow:0 0 0 0 rgba(47,212,168,.6)}.gg-auto.on i{animation:ggp 1.8s infinite}@keyframes ggp{70%{box-shadow:0 0 0 8px rgba(47,212,168,0)}100%{box-shadow:0 0 0 0 rgba(47,212,168,0)}}html.sin-3d .gg-auto{display:none}';
    D.head.appendChild(css);
    var btn=D.createElement('button');btn.type='button';btn.className='gg-auto';btn.setAttribute('aria-label','Recorrido automático');btn.innerHTML='<i></i><span></span>';D.body.appendChild(btn);
    function pinta(){btn.classList.toggle('on',activo);btn.querySelector('span').textContent=activo?'Pausar recorrido':(fin?'Repetir recorrido':(tope?'Continuar recorrido':'Reproducir recorrido'));btn.setAttribute('aria-pressed',activo?'true':'false')}
    function maxY(){return Math.max(0,R.scrollHeight-innerHeight)}
    function puntos(){
      var A=(cfg.anclas?cfg.anclas():(window.GG3D&&window.GG3D.anclas)||[]).slice().map(function(v){return Math.min(Math.round(v),maxY())});
      if(!A.length)A=[0,maxY()];
      A=A.filter(function(v,i){return i===0||v>A[i-1]+4});
      if(lim!==undefined&&lim!==null&&A[lim]!==undefined)A=A.slice(0,lim+1);
      var P=[];for(var i=0;i<A.length;i++){
        if(i>0){var d=A[i]-A[i-1],n=Math.ceil(d/(cfg.paso||900));for(var k=1;k<n;k++)P.push(A[i-1]+d*k/n)}
        P.push(A[i]);
      }
      return P;
    }
    function siguiente(){
      var P=puntos(),y=window.scrollY,t=null;
      for(var i=0;i<P.length;i++)if(P[i]>y+6){t=P[i];break}
      if(t===null){if(lim!=null)tope=true;else fin=true;parar();return false}
      var d=t-y;seg={y0:y,y1:t,T:Math.max(5.5,Math.min(12,d/(cfg.vel||80))),t:0};return true;
    }
    function ease(u){return .3*u+.7*(.5-.5*Math.cos(Math.PI*u))}
    function cuadro(ts){
      if(!activo)return;raf=requestAnimationFrame(cuadro);
      var dt=Math.min(.25,(ts-tPrev)/1000||.016);tPrev=ts;
      if(ultY>=0&&Math.abs(window.scrollY-ultY)>4){parar();return}   /* el visitante movió el scroll (barra, teclas, rueda) */
      if(espera>0){espera-=dt;ultY=window.scrollY;if(espera<=0&&!siguiente())return;return}
      if(!seg){if(!siguiente())return}
      seg.t+=dt;var u=Math.min(1,seg.t/seg.T),y=seg.y0+(seg.y1-seg.y0)*ease(u);
      irAhora(y);ultY=window.scrollY;
      if(u>=1){seg=null;espera=cfg.pausa||2.6;
        var P=puntos();if(window.scrollY>=P[P.length-1]-6){if(lim!=null)tope=true;else fin=true;parar()}}
    }
    function arrancar(){
      if(activo)return;
      if(fin){fin=false;irAhora(0)}
      if(tope){tope=false;lim=null}
      activo=true;seg=null;espera=.4;ultY=window.scrollY;tPrev=performance.now();pinta();raf=requestAnimationFrame(cuadro);
    }
    function parar(){if(!activo&&!raf)return;activo=false;cancelAnimationFrame(raf);raf=0;seg=null;pinta()}
    ['wheel','touchstart','keydown','mousedown'].forEach(function(ev){addEventListener(ev,function(e){if(e.isTrusted&&!(e.target.closest&&e.target.closest('.gg-auto')))parar()},{passive:true,capture:true})});
    addEventListener('pointermove',function(e){if(!e.isTrusted||e.pointerType==='touch')return;if(mx!==null){mov+=Math.abs(e.clientX-mx)+Math.abs(e.clientY-my);if(mov>18)parar()}mx=e.clientX;my=e.clientY},{passive:true});
    btn.addEventListener('click',function(){if(activo)parar();else{mov=0;arrancar()}});
    pinta();
    window.GGAuto={parar:parar,arrancar:arrancar,activo:function(){return activo}};
    if(!sinAuto&&window.scrollY<40)setTimeout(function(){if(!activo&&mov<=18&&!fin&&window.scrollY<40)arrancar()},cfg.inicio||3500);
  }
  if(D.readyState!=='loading')setTimeout(iniciar,300);else D.addEventListener('DOMContentLoaded',function(){setTimeout(iniciar,300)});
})();
