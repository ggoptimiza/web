/* Configuración del ecosistema GG Optimiza. Edita aquí las rutas cuando publiques las páginas.
   activa:true  -> el acceso lleva a la ruta indicada.
   activa:false -> la página aún no existe: el acceso abre WhatsApp con un mensaje prellenado.
   Empresarial y Dedicado quedan en true porque sus páginas ya existen como carpetas hermanas
   (../vabien-empresarial y ../vabien-dedicado). Si las publicas en otra URL, cámbiala aquí. */
window.GG_CONFIG={
  rutas:{
    corporativo:'index.html',
    esencial:{url:'../gg-cine/index.html',activa:true},
    empresarial:{url:'../vabien-empresarial/index.html',activa:true},
    dedicado:{url:'../vabien-dedicado/index.html',activa:true}
  },
  nombres:{esencial:'Esencial',empresarial:'VaBien Empresarial',dedicado:'VaBien Dedicado'},
  contacto:{whatsapp:'593963545517',visible:'0963 545 517',correo:'global@ggoptimiza.com'}
};
