/**

  FIGUS

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
  tamanioAlbum: 6,
  modoFuncionesDefault: function() { return 'none'; }
};

Juego.tiemposBloque = {
  controls_whileUntil:2,
  controls_repeat_ext:2,
  math_number:2,
  logic_boolean:2,
  math_on_list_figus:4,
  logic_compare_figus:2
};

Juego.acciones = [
  'crearAlbum','crearAlbumX','faltaFiguEnÁlbum',
  'comprarFigu','pegarFigu',
  'crearContador','incrementarContador','contador',
  'crearAnotador','anotar','anotador',
  'decir'
];

Mila.generador.header = 'var var_anotador = [];\n';

for (let a of Juego.acciones) {
  Mila.generador.addReservedWords(a);
  Mila.generador[a] = function(bloque){
    if (a == 'anotador') {
      return [`(anotador()||var_anotador)`,0];
    }
    let resultado = a + `(${Juego.argsBloque(bloque)})`;
    if (['faltaFiguEnÁlbum','contador'].includes(a)) {
      resultado = [resultado, 0];
    } else {
      resultado += ";\n";
      if (a == 'anotar') {
        resultado += `var_anotador.push(${Juego.argsBloque(bloque)});\n`;
      }
    }
    return resultado;
  };
  Juego.tiemposBloque[a] = 4;
}

Juego.argsBloque = function(bloque) {
  if (['anotar','decir','crearAlbumX'].includes(bloque.type)) {
    return Mila.generador.valueToCode(bloque, "X", 0);
  }
  return '';
}

// Inicializa todo lo necesario antes de que se termine de cargar la página
Juego.preCarga = function() {
  Mila.agregarScriptFuente(`src/juegos/figus/bloques.js`);
  Juego.tamanioFijo = Mila.argumentoURL('fix') || 'S'; // 'N' o 'S'
  if (Juego.tamanioFijo == 'N') {
    Juego.imagenesCargadas = 0;
  } else {
    for (let i=0; i<6; i++) {
      Mila.agregarImagenFuenteLocal(`figus/figu${i}.png`, `figu${i}`);
    }
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

// Ordena el movimiento de un robot en el mapa
Juego.mover = function(robot, direccion, args) {
  let i;
  switch (direccion) {
    case 'crearAlbum':
      Juego.nuevoAlbum(6);
      break;
    case 'crearAlbumX':
      Juego.nuevoAlbum(args === undefined ? '6' : args);
      break;
    case 'faltaFiguEnÁlbum':
      if (Juego.elementos.album.length == 0) {
        alert("Todavía no creaste el álbum");
        Mila.detener();
        break;
      }
      return Juego.elementos.album.some((x) => x.imagen === 'vacia');
      break;
    case 'comprarFigu':
      if ('figuActual' in Juego.elementos) {
        Juego.elementos.figuActual.del = true;
      }
      i = Math.floor(Math.random()*Juego.tamanioAlbum);
      Juego.elementos.figuActual = {imagen:`figu${i}`, x:120, y:10, scale:.3, i:i};
      Canvas.nuevoObjeto(Juego.elementos.figuActual);
      break;
    case 'pegarFigu':
      if (!('figuActual' in Juego.elementos)) {
        alert("No tenés ninguna figu para pegar");
        Mila.detener();
        break;
      }
      if (Juego.elementos.album.length == 0) {
        alert("Todavía no creaste el álbum");
        Mila.detener();
        break;
      }
      i = Juego.elementos.figuActual.i;
      Juego.elementos.figuActual.x = 10+Juego.espacioEntreFigus()*i;
      Juego.elementos.figuActual.y = 130;
      Juego.elementos.figuActual.scale = Juego.escalaFigus();
      Juego.elementos.album[i].del = true;
      Juego.elementos.album[i] = Juego.elementos.figuActual;
      delete Juego.elementos.figuActual;
      break;
    case 'crearContador':
      if ('contador' in Juego.elementos) {
        Juego.elementos.contador.texto = 0;
      } else {
        let c = {texto:0, x:310, y:45};
        Juego.elementos.contador = c;
        Canvas.nuevoObjeto(c);
        Canvas.nuevoObjeto({texto:"Contador:", x:220, y:45});
      }
      break;
    case 'incrementarContador':
      if (!('contador' in Juego.elementos)) {
        alert("Todavía no creaste el contador");
        Mila.detener();
        break;
      }
      Juego.elementos.contador.texto += 1;
      break;
    case 'contador':
      if (!('contador' in Juego.elementos)) {
        alert("Todavía no creaste el contador");
        Mila.detener();
        break;
      }
      return Juego.elementos.contador.texto;
      break;
    case 'crearAnotador':
      if ('anotador' in Juego.elementos) {
        for (let e of Juego.elementos.anotador) {
          e.del = true;
        }
      } else {
        Canvas.nuevoObjeto({imagen:"nota", x:-5, y:255,scale:0.81});
        Canvas.nuevoObjeto({texto:"Anotador:", x:10, y:260});
      }
      Juego.elementos.anotador = [];
      break;
    case 'anotar':
      if (!('anotador' in Juego.elementos)) {
        alert("Todavía no creaste el anotador");
        Mila.detener();
        break;
      } else {
        let a = {texto:(args === undefined ? '?' : args), scale:.9,
          x:50 + 42*(Math.floor(Juego.elementos.anotador.length % 10)),
          y:290 + 29*(Math.floor(Juego.elementos.anotador.length / 10))
        };
        Juego.elementos.anotador.push(a);
        Canvas.nuevoObjeto(a);
      }
      break;
    case 'anotador':
      if (!('anotador' in Juego.elementos)) {
        alert("Todavía no creaste el anotador");
        Mila.detener();
        break;
      }
      return undefined;
      break;
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
      code = list + '.reduce(function(x, y) {return x * y;})';
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

Juego.cargarMasImagenes = function(k) {
  while (Juego.imagenesCargadas < k) {
    Canvas.declararComposicion(`figu${Juego.imagenesCargadas}`, Juego.nuevaFigu(Juego.imagenesCargadas));
    Juego.imagenesCargadas++;
  }
};

Juego.nuevaFigu = function(k) {
  return [{
    clase:'rect', x:25, fondo:`#${Juego.colorFigu(k)}`, w:145, h:195
  }].concat(
    [10,80,160,230,310,380].map(function(x) {
      return {clase:'rect', x:30+x%150, y:20+55*Math.floor(x/150), w:40, h:40,
        fondo:`#${Juego.colorFigu(x*k+(k/5)-x)}`, borde:`#${Juego.colorFigu(k-(x*k/5)+x)}`};
    })
  );
};

Juego.colorFigu = function(k) {
  const C = (x) => ((Math.floor(x)*25)%255).toString(16).padStart(2, '0');
  return C(k+200)+C(60*(k/10)+k+100)+C(120*(k/20)+k+75);
};

Juego.escalaFigus = function() {
  return 0.3 - 0.1 * ((Math.min(Juego.tamanioAlbum,20)-6)/6);
};

Juego.espacioEntreFigus = function() {
  return 180*Juego.escalaFigus();
};

Juego.nuevoAlbum = function(k) {
  if (Juego.elementos.album.length > 0) {
    for (let e of Juego.elementos.album) {
      e.del = true;
    }
    Juego.elementos.album = [];
  } else {
    Canvas.nuevoObjeto({texto:"Álbum:", x:10, y:120});
  }
  if (Juego.tamanioFijo == 'N') {
    Juego.tamanioAlbum = k;
    Juego.cargarMasImagenes(Juego.tamanioAlbum);
  } else {
    Juego.tamanioAlbum = 6;
  }
  for (i=0; i<Juego.tamanioAlbum; i++) {
    let img = {imagen:'vacia', x:10+Juego.espacioEntreFigus()*i, y:130, rot:0, scale:Juego.escalaFigus()};
    Juego.elementos.album.push(img);
    Canvas.nuevoObjeto(img);
  }
};
