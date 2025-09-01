/**

  FIGUS 2

  Juego para simular el llenado de un álbum de figuritas

  VARIABLES
    robots          Lista de robots en juego
    tiemposBloque   Duración de cada bloque

  FUNCIONES
    preCarga        Inicializa todo lo necesario antes de que se termine de cargar la página
    inicializar     Inicializa todo lo necesario una vez que se termina de cargar la página
    reiniciar       Reinicia la ejecución del juego
    detener         Detiene el juego

    mover           Ordena el movimiento de un robot en el mapa

**/

const Juego = {
  modoFuncionesDefault: function() { return 'all'; }
};

Juego.tiemposBloque = {
  controls_whileUntil:2,
  controls_repeat_ext:2,
  math_number:2,
  logic_boolean:2,
  math_on_list_figus:1,
  logic_compare_figus:1,
  math_arithmetic:1,
  math_random_int:2
};

Juego.acciones = [
  'var_assign','album','figuActual','contador','anotador',
  'list_assign','list_push',
  'decir'
];

Mila.generador.header = 'var var_album = undefined;\nvar var_anotador = undefined;\nvar var_figuActual = undefined;\nvar var_contador = undefined;\n';

Mila.generador.listaVacia = function(bloque) {
  return ["[]",0];
};
Mila.generador.lista6Ceros = function(bloque) {
  return ["[0,0,0,0,0,0]",0];
};
for (let a of Juego.acciones) {
  Mila.generador.addReservedWords(a);
  Mila.generador[a] = function(bloque){
    if (['album','figuActual','contador','anotador'].includes(a)) {
      return [`(${a}()||var_${a})`,0];
    }
    let args = Juego.argsBloque(bloque);
    if (a == 'var_assign') {
      let v = bloque.getFieldValue('VAR');
      let arg_b = Juego.argsBloqueJuego(bloque, v);
      return `${v} = ${(args||"undefined")};\nvar_assign({v:"${v}",a:${arg_b}});\n`;
    }
    if (a == 'list_assign') {
      let v = bloque.getFieldValue('VAR');
      let pos = Mila.generador.valueToCode(bloque, "POS", 0);
      let arg_b = Juego.argsBloqueJuego(bloque, args);
      return `list_assign({v:"${v}",p:${pos},a:${arg_b}});\n${v}[${pos}] = ${args};\n`;
    }
    if (a == 'list_push') {
      let v = bloque.getFieldValue('VAR');
      let arg_b = Juego.argsBloqueJuego(bloque, args);
      return `list_push({v:"${v}",a:${arg_b}});\n${v}.push(${args});\n`;
    } // decir
    return `${a}(${args});\n`;
  };
  Juego.tiemposBloque[a] = 2;
}

Juego.argsBloque = function(bloque) {
  if (['decir','var_assign','list_push','list_assign'].includes(bloque.type)) {
    return Mila.generador.valueToCode(bloque, "X", 0);
  }
  return '';
};

Juego.argsBloqueJuego = function(bloque, defecto) {
  let arg_b = bloque.getInputTargetBlock('X');
  if (arg_b === null) {
    return 'undefined'
  }
  if (['listaVacia','lista6Ceros'].includes(arg_b.type)) {
    return `"${arg_b.type}"`;
  }
  if (['album','figuActual','contador','anotador'].includes(arg_b.type)) {
    return `var_${arg_b.type}`;
  }
  return defecto;
};

// Inicializa todo lo necesario antes de que se termine de cargar la página
Juego.preCarga = function() {
  Mila.agregarScriptFuente(`src/juegos/figus/bloques.js`);
  for (let i=0; i<6; i++) {
    Mila.agregarImagenFuenteLocal(`figus/figu${i}.png`, `figu${i}`);
  }
  Mila.agregarImagenFuenteLocal(`figus/vacia.png`, 'vacia');
  Mila.agregarImagenFuenteLocal(`figus/nota.png`, 'nota');
  Mila.agregarScriptFuente('src/lib/seedrandom.js');
};

// Inicializa todo lo necesario una vez que se termina de cargar la página
Juego.inicializar = function() {
  Juego.robots = []; // Necesito que el campo "robots" exista antes de llamar a reiniciar
  Juego.reiniciar();
};

// Reinicia la ejecución del juego
Juego.reiniciar = function() {
  Juego.detener();
  Juego.robots = [{rol:"AUTO"}];
  Juego.elementos = {
    album: [],
  };
  Canvas.nuevoObjeto({texto:"Nueva figu:", x:10, y:45});
  Math.seedrandom('nombreJugador' in Juego ? Juego.nombreJugador : Math.random());
}

// Detiene el juego
Juego.detener = function() {
  for (robot of Juego.robots) {
    clearInterval(robot.intervalo); // Si había un movimiento programado, lo anulo
  }
};

function crearAlbum(args) {
  if (Juego.elementos.album.length > 0) {
    for (let e of Juego.elementos.album) {
      e.del = true;
    }
  } else {
    Canvas.nuevoObjeto({texto:"Álbum:", x:10, y:120});
  }
  Juego.elementos.album = [];
  if (args === "lista6Ceros") {
    for (i=0; i<6; i++) {
      let img = {texto:0, x:10+65*i, y:160, rot:0, scale:2};
      Juego.elementos.album.push(img);
      Canvas.nuevoObjeto(img);
    }
    for (i=0; i<6; i++) {
      let index = {texto:i, x:17+65*i, y:180, rot:0, scale:.8};
      Juego.elementos.album.push(index);
      Canvas.nuevoObjeto(index);
    }
  } else if (typeof args === "number") {
    let n = {texto:args, x:80, y:120, rot:0};
    Juego.elementos.album.push(n);
    Canvas.nuevoObjeto(n);
  }
};

function comprarFigu(i) {
  if (typeof i !== 'number') {
    i = "?"
  }
  if ('figuActual' in Juego.elementos) {
    Juego.elementos.figuActual.del = true;
  }
  Juego.elementos.figuActual = {texto:i, x:120, y:50, scale:2};
  Canvas.nuevoObjeto(Juego.elementos.figuActual);

};

function asignarContador(args) {
  if (typeof args !== 'number') {
    args = "?"
  }
  if ('contador' in Juego.elementos) {
    Juego.elementos.contador.texto = args;
  } else {
    let c = {texto:args, x:310, y:45};
    Juego.elementos.contador = c;
    Canvas.nuevoObjeto(c);
    Canvas.nuevoObjeto({texto:"Contador:", x:220, y:45});
  }
};

function crearAnotador(args) {
  if ('anotador' in Juego.elementos) {
    for (let e of Juego.elementos.anotador) {
      e.del = true;
    }
  } else {
    Canvas.nuevoObjeto({texto:"Anotador:", x:10, y:260});
  }
  Juego.elementos.anotador = [];
  if (args === "lista6Ceros") {
    for (i=0; i<6; i++) {
      anotar("0");
    }
  } else if (typeof args === "number") {
    let n = {texto:args, x:108, y:260, rot:0};
    Juego.elementos.anotador.push(n);
    Canvas.nuevoObjeto(n);
  }
};

function pegarFigu(pos, i) {
  if (typeof pos === 'number') {
    if (pos >= 0 && pos <= 5) {
      Juego.elementos.album[pos].texto = i;
    }
  }
}

function anotar(args) {
  if (!('anotador' in Juego.elementos)) {
    alert("Todavía no creaste el anotador");
    Mila.detener();
  } else {
    let a = {texto:(args === undefined ? '?' : args),
      x:10+50*(Math.floor(Juego.elementos.anotador.length % 8)),
      y:285 + 24*(Math.floor(Juego.elementos.anotador.length / 8))
    };
    Juego.elementos.anotador.push(a);
    Canvas.nuevoObjeto(a);
  }
};

// Ordena el movimiento de un robot en el mapa
Juego.mover = function(robot, direccion, args) {
  let i, v, pos;
  switch (direccion) {
    case 'var_assign':
      v = args.v;
      args = args.a;
      switch (v) {
        case 'var_album':
          crearAlbum(args);
          break;
        case 'var_figuActual':
          comprarFigu(args);
          break;
        case 'var_contador':
          asignarContador(args);
          break;
        case 'var_anotador':
          crearAnotador(args);
          break;
        default:
          //
      }
      break;
    case 'list_assign':
      v = args.v;
      pos = args.p;
      args = args.a;
      let list_len = 0;
      switch (v) {
        case 'var_album':
          if (Juego.elementos.album.length == 0) {
            alert("Todavía no creaste el álbum");
            Mila.detener();
            break;
          }
          list_len = Juego.elementos.album.length;
          pegarFigu(pos, args);
          break;
        case 'var_anotador':
          list_len = Juego.elementos.anotador.length;
          break;
        default:
          //
      }
      if (pos >= list_len) {
        alert(`No podés asignar la posición ${pos} porque la lista tiene tamaño ${list_len}`);
        Mila.detener();
      }
      break;
    case 'list_push':
      v = args.v;
      args = args.a;
      switch (v) {
        case 'var_album':
          if (Juego.elementos.album.length == 0) {
            alert("Todavía no creaste el álbum");
            Mila.detener();
            break;
          }
          break;
        case 'var_anotador':
          anotar(args);
          break;
        default:
          //
      }
      break;
    case 'album':
      if (Juego.elementos.album.length == 0) {
        alert("Todavía no creaste el álbum");
        Mila.detener();
        break;
      }
      return undefined;
    case 'figuActual':
      if (!('figuActual' in Juego.elementos)) {
        alert("No tenés ninguna figu");
        Mila.detener();
        break;
      }
      return undefined;
    case 'contador':
      if (!('contador' in Juego.elementos)) {
        alert("Todavía no creaste el contador");
        Mila.detener();
        break;
      }
      return undefined;
      break;
    case 'anotar':
      anotar(args);
      break;
    case 'anotador':
      if (!('anotador' in Juego.elementos)) {
        alert("Todavía no creaste el anotador");
        Mila.detener();
        break;
      }
      return undefined;
    case 'decir':
      alert(args === undefined ? '?' : args);
      break;
    default:
      //
  }
};

Juego.roles = function() {
  return [
    ["Programa", "AUTO"]
  ];
};

Juego.paso = function() {
};

Juego.jugador = function(nombre) {
  if (nombre) {
    Juego.nombreJugador = nombre;
  } else {
    delete Juego.nombreJugador;
  }
};

// Antes de terminar de cargar la página, llamo a esta función
Juego.preCarga();

Blockly.JavaScript['math_on_list_figus'] = function(block) {
  // Math functions for lists.
  var func = block.getFieldValue('OP');
  var list, code;
  switch (func) {
    case 'SUM':
      list = Blockly.JavaScript.valueToCode(block, 'X',
          Blockly.JavaScript.ORDER_MEMBER) || '[]';
      code = list + '.reduce(function(x, y) {return x + y;})';
      break;
    case 'PROD':
      list = Blockly.JavaScript.valueToCode(block, 'X',
          Blockly.JavaScript.ORDER_MEMBER) || '[]';
      code = list + '.reduce(function(x, y) {return x + y;})';
      break;
    case 'AVERAGE':
      var functionName = Blockly.JavaScript.provideFunction_(
          'mathMean',
          ['function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
              '(myList) {',
            '  return myList.reduce(function(x, y) {return x + y;}) / ' +
                  'myList.length;',
            '}']);
      list = Blockly.JavaScript.valueToCode(block, 'X',
          Blockly.JavaScript.ORDER_NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    default:
      throw Error('Unknown operator: ' + func);
  }
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['logic_compare_figus'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'LT': '<',
    'GT': '>',
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.JavaScript.ORDER_EQUALITY : Blockly.JavaScript.ORDER_RELATIONAL;
  var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};
