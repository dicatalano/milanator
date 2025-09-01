/**

  LAYOUT

  Módulo para configurar la interfaz

  FUNCIONES
    inicializar     Inicializa todo lo necesario una vez que se termina de cargar la página

**/

const Layout = {
  Horizontal: 1,
  Vertical: 2,
  proporcion: 0.65
};

const layout = {dist:Layout.Horizontal}; // default

Layout.inicializar = function() {
  Object.assign(layout, (Juego.layout || {}));
  const tabla = document.getElementById('layout');
  const blockly = document.getElementById('blockly');
  const canvas = document.getElementById('canvas');
  let cel = document.createElement('td');
  cel.setAttribute('classname', 'np');
  let row = document.createElement('tr');
  tabla.appendChild(row);
  row.appendChild(cel);
  cel.appendChild(blockly);
  if (layout.dist == Layout.Vertical) {
    row = document.createElement('tr');
    tabla.appendChild(row);
  }
  cel = document.createElement('td');
  cel.setAttribute('classname', 'np');
  row.appendChild(cel);
  cel.appendChild(canvas);
  document.getElementById(`${layout.dist == Layout.Horizontal ? 'h' : 'v'}Resize`)
    .addEventListener('mousedown', Layout.empezar_resize);
};

Layout.anchoCanvas = function() {
  return (layout.dist == Layout.Horizontal
    ? window.innerWidth - Layout.anchoBlockly() - 30
    : window.innerWidth - 20
  );
};

Layout.altoCanvas = function() {
  return (layout.dist == Layout.Horizontal
    ? window.innerHeight - 60
    : window.innerHeight - Layout.altoBlockly() - 70
  );
};

Layout.anchoBlockly = function() {
  return (layout.dist == Layout.Horizontal
    ? window.innerWidth * Layout.proporcion - 10
    : window.innerWidth - 15
  );
};

Layout.altoBlockly = function() {
  return (layout.dist == Layout.Horizontal
    ? window.innerHeight - 55
    : (window.innerHeight - 70) * Layout.proporcion - 10
  );
};

Layout.redimensionar = function() {
  const area2 = document.getElementById('canvas').getClientRects()[0];
  const selector = document.getElementById(`${layout.dist == Layout.Horizontal ? 'h' : 'v'}Resize`);
  if (layout.dist == Layout.Horizontal) {
    selector.style['top'] = `${area2.y}px`;
    selector.style['left'] = `${area2.x-12}px`;
    selector.style['height'] = `${area2.height}px`;
  } else {
    selector.style['top'] = `${area2.y-12}px`;
    selector.style['left'] = `${area2.x}px`;
    selector.style['width'] = `${area2.width}px`;
  }
};

Layout.empezar_resize = function() {
  Layout.resizeando = true;
  document.body.addEventListener('mousemove', Layout.en_resize);
  document.body.addEventListener('mouseup', Layout.terminar_resize);
};

Layout.en_resize = function(evento) {
  if (Layout.resizeando) {
    Layout.proporcion = (layout.dist == Layout.Horizontal
      ? Math.max(Math.min(evento.clientX / window.innerWidth, .9), .1)
      : Math.max(Math.min(evento.clientY / window.innerHeight, .9), .1)
    );
    Mila.redimensionar();
  } else {
    Layout.terminar_resize();
  }
};

Layout.terminar_resize = function(evento) {
  Layout.resizeando = false;
  document.body.removeEventListener('mouseup', Layout.terminar_resize);
  document.body.removeEventListener('mousemove', Layout.en_resize);
};