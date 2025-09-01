/**

  CANVAS

  Módulo para dibujar en el canvas

  VARIABLES
    div         La div del canvas en el documento
    ancho       El ancho del canvas en píxeles
    alto        El alto del canvas en píxeles
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

const Canvas = {
  composiciones:{}
};

// Inicializa todo lo necesario una vez que se termina de cargar la página
Canvas.inicializar = function() {
  Canvas.div = document.getElementById('canvas');
  Canvas.contexto = Canvas.div.getContext("2d");
  Canvas.reiniciar();
};

// Esta función se ejecuta cada vez que cambia el tamaño de la ventana del navegador
//  (y una vez cuando se inicializa la página)
Canvas.redimensionar = function() {
  Canvas.alto = Layout.altoCanvas();
  Canvas.div.height = Canvas.alto;
  Canvas.ancho = Layout.anchoCanvas();
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
  Canvas.objetos = Canvas.objetos.filter((x) => !('del' in x));
  for (objeto of Canvas.objetos) {
    if ('imagen' in objeto) {
      Canvas.imagen(objeto.imagen, objeto.x, objeto.y, objeto.scale, objeto.rot);
    } else if ('texto' in objeto) {
      Canvas.texto(objeto.texto, objeto.x, objeto.y, objeto.scale, objeto.rot);
    }
  }
};

// Borra todo lo que haya en el canvas
Canvas.limpiar = function() {
  Canvas.contexto.clearRect(0, 0, Canvas.div.width, Canvas.div.height);
};

// Dibuja una imagen en el canvas
Canvas.imagen = function(id, x, y, s=1, r=0) {
  if (id in Canvas.composiciones) {
    Canvas.dibujarComposicion(Canvas.composiciones[id], x, y, s, r);
  } else {
    Canvas.contexto.save();
    const img = document.getElementById(id);
    let w = img.width*s;
    let h = img.height*s;
    Canvas.contexto.translate(x+w/2,y+h/2);
    Canvas.contexto.rotate(r*Math.PI/180);
    Canvas.contexto.translate(-x-w/2,-y-h/2);
    Canvas.contexto.drawImage(img, x, y, w, h);
    Canvas.contexto.restore();
  }
};

// Escribe texto en el canvas
Canvas.texto = function(t, x, y, s=1, r=0) {
  Canvas.contexto.font = `${20*s}px arial`;
  Canvas.contexto.fillText(t, x, y);
}

// Agrega un objeto a dibujar en cada refresco de pantalla
  // Debe tener los campos: x, y
  // Además debe tener alguno de los siguientes: imagen, texto
  // Campos adicionales opcionales: scale, rot
Canvas.nuevoObjeto = function(objeto) {
  Canvas.objetos.push(objeto);
  return objeto;
};

Canvas.dibujarComposicion = function(cs, xG, yG, sG=1, rG=0) {
  for (let c of cs) {
    Canvas.contexto.save();
    if (c.clase == 'rect') {
      let x = xG;
      x += ('x' in c ? c.x : 0)*sG;
      let y = yG;
      y += ('y' in c ? c.y : 0)*sG;
      let w = ('w' in c ? c.w : 100)*sG;
      let h = ('h' in c ? c.h : 100)*sG;
      Canvas.contexto.beginPath();
      if ('borde' in c) {
        Canvas.contexto.strokeStyle = c.borde;
      }
      if ('fondo' in c) {
        Canvas.contexto.fillStyle = c.fondo;
        Canvas.contexto.fillRect(x, y, w, h);
        Canvas.contexto.strokeRect(x, y, w, h);
      } else {
        Canvas.contexto.rect(x, y, w, h);
        Canvas.contexto.stroke();
      }
    }
    Canvas.contexto.restore();
  }
};

Canvas.declararComposicion = function(nombre, significado) {
  Canvas.composiciones[nombre] = significado;
};