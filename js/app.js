/* Interfaz: contacto, rutas del ecosistema, formulario y salida suave. Sin dependencias. */
(function(){
  var C=window.GG_CONFIG,D=document;
  function wa(txt){return 'https://wa.me/'+C.contacto.whatsapp+'?text='+encodeURIComponent(txt)}
  [].slice.call(D.querySelectorAll('[data-wa]')).forEach(function(a){a.href=wa('Hola, quiero información sobre GG Optimiza.');a.setAttribute('rel','noopener')});
  [].slice.call(D.querySelectorAll('[data-dato-wa]')).forEach(function(e){e.textContent='WhatsApp '+C.contacto.visible});
  [].slice.call(D.querySelectorAll('[data-dato-correo]')).forEach(function(a){a.textContent=C.contacto.correo;a.href='mailto:'+C.contacto.correo});
  [].slice.call(D.querySelectorAll('[data-ruta]')).forEach(function(a){
    var k=a.getAttribute('data-ruta'),r=C.rutas[k];
    if(k==='corporativo'){a.href=C.rutas.corporativo;return}
    if(r&&r.activa){a.href=r.url;a.setAttribute('data-externa','1')}
    else{a.href=wa('Hola, quiero información sobre '+C.nombres[k]+'.');a.setAttribute('rel','noopener');a.setAttribute('data-consulta','1')}
  });
  D.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[data-externa]');if(!a||e.ctrlKey||e.metaKey||e.shiftKey||e.button)return;
    e.preventDefault();D.documentElement.classList.add('saliendo');var u=a.href;setTimeout(function(){location.href=u},200);
  });
  addEventListener('pageshow',function(){D.documentElement.classList.remove('saliendo')});
  var f=D.getElementById('formulario'),av=D.getElementById('f-aviso');
  if(f)f.addEventListener('submit',function(e){
    e.preventDefault();var n=D.getElementById('f-nombre').value.trim(),em=D.getElementById('f-empresa').value.trim(),m=D.getElementById('f-mensaje').value.trim();
    if(!n||!m){av.textContent='Escribe tu nombre y cuéntanos qué quieres mejorar en tu empresa.';return}
    av.textContent='Abriendo WhatsApp…';
    window.open(wa('Hola, soy '+n+(em?' de '+em:'')+'. Quiero conversar con GG Optimiza. '+m),'_blank','noopener');
  });
})();
