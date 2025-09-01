/**

  CANVAS

  Módulo para dibujar en el canvas

  VARIABLES
    div         La div del canvas en el documento
    ancho       El ancho del canvas en píxeles
    objetos     Lista de objetos que se dibujan en el canvas

  FUNCIONES
    inicializar     Inicializa todo lo necesario una vez que se termina de cargar la página
    redimensionar   Esta función se ejecuta cada vez que cambia el tamaño de la ventana del navegador
    reiniciar       Reinicia el canvas eliminando todos los objetos
    actualizar      Refresca lo que muestra el canvas
      limpiar         Borra todo lo que haya en el canvas
      imagen          Dibuja una imagen en el canvas

    nuevoObjeto     Agrega un objeto a dibujar en cada refresco de pantalla

**/

const Canvas = {};

// Inicializa todo lo necesario una vez que se termina de cargar la página
Canvas.inicializar = function() {
  Canvas.div = document.getElementById('canvas');
  Canvas.contexto = Canvas.div.getContext("2d");
  Canvas.reiniciar();
};

// Esta función se ejecuta cada vez que cambia el tamaño de la ventana del navegador
//  (y una vez cuando se inicializa la página)
Canvas.redimensionar = function() {
  Canvas.div.height = window.innerHeight-35;
  Canvas.ancho = 400; //window.innerWidth/2-5;
  Canvas.div.width = Canvas.ancho;
  Canvas.actualizar();
};

// Reinicia el canvas eliminando todos los objetos
Canvas.reiniciar = function() {
  Canvas.objetos = [];
};

// Refresca lo que muestra el canvas
Canvas.actualizar = function() {
  Canvas.limpiar();
  for (objeto of Canvas.objetos) {
    Canvas.imagen(objeto.imagen, objeto.x, objeto.y, objeto.rot);
  }
};

// Borra todo lo que haya en el canvas
Canvas.limpiar = function() {
  Canvas.contexto.clearRect(0, 0, Canvas.div.width, Canvas.div.height);
};

// Dibuja una imagen en el canvas
Canvas.imagen = function(id, x, y, r=0) {
  Canvas.contexto.save();
  const img = document.getElementById(id);
  Canvas.contexto.translate(x+img.width/2,y+img.height/2);
  Canvas.contexto.rotate(r*Math.PI/180);
  Canvas.contexto.translate(-x-img.width/2,-y-img.height/2);
  Canvas.contexto.drawImage(img, x, y);
  Canvas.contexto.restore();
}

// Agrega un objeto a dibujar en cada refresco de pantalla
  // Debe tener los campos: imagen, x, y, rot
Canvas.nuevoObjeto = function(objeto) {
  Canvas.objetos.push(objeto);
};
