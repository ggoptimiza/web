/* Rutas del ecosistema GG Optimiza (configurables).
   activa:true  -> el enlace lleva a la ruta indicada.
   activa:false -> la página aún no existe: el enlace abre WhatsApp con un mensaje prellenado.
   Estas rutas son locales/relativas y provisionales; se ajustarán cuando se defina la publicación final. */
window.GG_CONFIG={
  rutas:{
    corporativo:{url:'../gg-corporativo/index.html',activa:true},
    esencial:{url:'../gg-cine/index.html',activa:true},
    dedicado:{url:'../vabien-dedicado/index.html',activa:false}
  },
  nombres:{corporativo:'GG Optimiza',esencial:'Esencial',dedicado:'VaBien Dedicado'},
  contacto:{whatsapp:'593963545517',visible:'0963 545 517',correo:'global@ggoptimiza.com'}
};
