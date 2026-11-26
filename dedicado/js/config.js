/* Rutas del ecosistema GG Optimiza (configurables).
   activa:true  -> el enlace lleva a la ruta indicada.
   activa:false -> la página aún no existe: el enlace abre WhatsApp con un mensaje prellenado.
   Rutas relativas y provisionales; se ajustarán cuando se defina la publicación final. */
window.GG_CONFIG={
  rutas:{
    corporativo:{url:'../index.html',activa:true},
    contacto:{url:'../index.html#contacto',activa:true},
    esencial:{url:'../esencial/index.html',activa:true},
    empresarial:{url:'../empresarial/index.html',activa:true}
  },
  nombres:{contacto:'Contacto',corporativo:'GG Optimiza',esencial:'Esencial',empresarial:'VaBien Empresarial'},
  contacto:{whatsapp:'593963545517',visible:'0963 545 517',correo:'global@ggoptimiza.com'}
};
