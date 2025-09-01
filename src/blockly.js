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
  Mila.Blockly.inicializarToolbox();
  Mila.Blockly.inyectarBlockly();   // Inyectar la interfaz de Blockly
  // Agrego un listener de eventos para guardar el workspace tras cada cambio
  Mila.workspace.addChangeListener(function(evento) {
    sessionStorage.xml = Mila.Blockly.generarXml(Mila.workspace);
    if (evento instanceof Blockly.Events.Move && evento.newParentId != null) {
      document.getElementById("botonEjecutar").classList.add("glow");
    }
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

// Inicializa el toolbox de Blockly
Mila.Blockly.inicializarToolbox = function() {
  let modoFunciones = Mila.argumentoURL('funciones');
  if (modoFunciones === '-') {
    modoFunciones = ('modoFuncionesDefault' in Juego)
      ? Juego.modoFuncionesDefault()
      : 'all';
  }
  // Borrar categoría de funciones
  if (modoFunciones === 'none') {
    const toolboxDom = Blockly.Xml.textToDom(Juego.toolbox);
    const categorias = [];
    for (let c of toolboxDom.children) {
      if (c.nodeName === 'category' && c.getAttribute('custom') === 'PROCEDURE') {
        categorias.push(c);
      }
    }
    for (let c of categorias) {
      toolboxDom.removeChild(c);
    }
    Juego.toolbox = Blockly.Xml.domToText(toolboxDom);
  } else if (modoFunciones === 'func') {
    delete Blockly.Blocks['procedures_defnoreturn'];
  } else if (modoFunciones === 'proc') {
    delete Blockly.Blocks['procedures_defreturn'];
  }
  delete Blockly.Blocks['procedures_ifreturn'];
  // Borrar categorías
  if (Mila.argumentoURL('toolbox') === 'off') {
    const toolboxDom = Blockly.Xml.textToDom(Juego.toolbox);
    const categorias = [];
    const bloques = [];
    for (let c of toolboxDom.children) {
      if (c.nodeName === 'category') {
        for (let b of c.children) {
          bloques.push(b);
        }
        categorias.push(c);
        if (c.getAttribute('custom') === 'PROCEDURE') {
          for (let b of ['procedures_defnoreturn','procedures_defreturn']) {
            if (Blockly.Blocks[b]) {
              let e = document.createElement('block');
              e.setAttribute('type', b);
              let f = document.createElement('field');
              f.setAttribute('name', 'NAME');
              f.innerHTML = Blockly.Msg.UNNAMED_KEY;
              e.appendChild(f);
              bloques.push(e);
            }
          }
        }
      }
    }
    for (let c of categorias) {
      toolboxDom.removeChild(c);
    }
    for (let b of bloques) {
      toolboxDom.appendChild(b);
    }
    Juego.toolbox = Blockly.Xml.domToText(toolboxDom);
  }
};

// Inyecta la interfaz Blockly en la div con id "blockly" y guarda el resultado en Mila.workspace
Mila.Blockly.inyectarBlockly = function() {
  // Toma como segundo argumento un objeto de configuración
  Mila.workspace = Blockly.inject('blockly', {
    toolbox: Juego.toolbox,                     // Set de bloques del juego actual
    move:{wheel:true, drag:true, scrollbars:true},
    zoom:{wheel:true, controls:true, minScale:0.1},
    trashcan:true,
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
  try {
    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
  } catch (error) {
    workspace.clear();
    Mila.Blockly.crearBloqueInicial(Mila.workspace);
  }
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

const oldGenerator = Blockly.Generator.prototype.blockToCode;
Blockly.Generator.prototype.blockToCode = function(block, opt_thisOnly) {
  if (block && block.previousConnection && !block.previousConnection.targetConnection) {
    return '';
  } else if (block && block.outputConnection && !block.outputConnection.targetConnection) {
    return ['',0];
  }
  return oldGenerator.call(this, block, opt_thisOnly);
};
