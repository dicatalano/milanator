/**

  MILA.Blockly

  Funciones para interactuar con Blockly

  FUNCIONES
    inicializar             Inicializa el entorno Blockly
      inyectarBlockly       Inyecta la interfaz Blockly en la div con id "blockly" y guarda el resultado en Mila.workspace
      crearBloqueInicial    Crea el bloque principal

    generarXml              Genera el xml de un workspace en formato string
    cargarDesdeXml          Crea los bloques en un workspace a partir de un xml en formato string

    nuevo                   Quita todos los bloques para empezar un proyecto nuevo
    exportar                Exporta el workspace a un archivo
    importar                Importa el workspace desde un archivo

**/

Mila.Blockly = {};

// Inicializa el entorno Blockly
Mila.Blockly.inicializar = function() {
  Mila.Blockly.inyectarBlockly();   // Inyectar la interfaz de Blockly
  // Agrego un listener de eventos para guardar el workspace tras cada cambio
  Mila.workspace.addChangeListener(function(evento) {
    sessionStorage.xml = Mila.Blockly.generarXml(Mila.workspace);
  });
  setTimeout(function() {
    Blockly.Events.recordUndo = false;
    // Me fijo si hay un workspace guardado
    if (sessionStorage.xml) {
      Mila.Blockly.cargarDesdeXml(Mila.workspace, sessionStorage.xml);
    // Si no, creo un workspace vacío
    } else {
      Mila.Blockly.crearBloqueInicial(Mila.workspace);
    }
    Blockly.Events.recordUndo = true;
  }, 100); // Si lo hago ahora no funciona, así que espero un poco
};

// Inyecta la interfaz Blockly en la div con id "blockly" y guarda el resultado en Mila.workspace
Mila.Blockly.inyectarBlockly = function() {
  // Toma como segundo argumento un objeto de configuración
  Mila.workspace = Blockly.inject('blockly', {
    toolbox: Juego.toolbox                      // Set de bloques del juego actual
  });
};

// Crea el bloque principal
Mila.Blockly.crearBloqueInicial = function(workspace) {
  let bloque = workspace.newBlock("robot_def");
  bloque.setDeletable(false);
  bloque.initSvg();
  bloque.render();
  bloque.moveBy(50,50);
};

// Genera el xml de un workspace en formato string
Mila.Blockly.generarXml = function(workspace) {
  return Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
};

// Crea los bloques en un workspace a partir de un xml en formato string
Mila.Blockly.cargarDesdeXml = function(workspace, xml) {
  Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
};

// Quita todos los bloques para empezar un proyecto nuevo
Mila.Blockly.nuevo = function(workspace) {
  Mila.Blockly.agrupar(function() {
    workspace.clear();
    Mila.Blockly.crearBloqueInicial(workspace);
  });
};

// Exporta el workspace a un archivo
Mila.Blockly.exportar = function(workspace, nombre) {
  if (nombre === null) {
    return;
  }
  let xml = Mila.Blockly.generarXml(workspace);
  let e = document.createElement('a');
  e.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(xml));
  e.setAttribute('download', `${nombre}.xml`);
  e.style.display = 'none';
  document.body.appendChild(e);
  e.click();
  document.body.removeChild(e);
};

// Importa el workspace desde un archivo
Mila.Blockly.importar = function(workspace) {
  let e = document.createElement('input');
  e.type = 'file';
  let div = document.createElement('div');
  div.style.display = 'none';
  div.appendChild(e);
  document.body.appendChild(div);
  e.addEventListener('change', function(x) {
    let archivo = x.target.files[0];
    if (archivo) {
      let reader = new FileReader();
      reader.onload = function() {
        workspace.clear();
        Mila.Blockly.agrupar(function() {
          Mila.Blockly.cargarDesdeXml(workspace, reader.result);
          document.body.removeChild(div);
        });
      }
      reader.readAsText(archivo);
    }
  }, false);
  e.click();
};

Mila.Blockly.agrupar = function(f) {
  let group = Blockly.Events.getGroup();
  if (!group) {
    Blockly.Events.setGroup(true);
  }

  f();

  if (!group) {
    Blockly.Events.setGroup(false);
  }
};
