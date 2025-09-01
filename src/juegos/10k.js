/**

  Diez mil

  Juego de dados en el que hay que tirar el cubilete hasta acumular 10 puntos con las siguientes reglas:
  - 50 puntos por cada cinco
  - 100 puntos por cada uno
  - 500 puntos adicionales si salen 3 cincos
  - 50 puntos adicionales si salen 4 cincos
  - 50 puntos adicionales si salen 4 cincos
  - 1000 puntos adicionales si salen 3 unos
  - 100 puntos adicionales si salen 4 unos
  - 8900 puntos adicionales si salen 5 unos

  VARIABLES

  FUNCIONES

**/

const posicionesDados = [
  {x:10,y:160},{x:130,y:130},
  {x:90,y:190},
  {x:50,y:250},{x:170,y:220},
];

const Juego = {
  CUBILETE: 0,
  DADO: 1,
  DELAY: 2,
  RONDA: 3,
  JUGADA: 4
};

Juego.tiemposBloque = {
  controls_whileUntil:2,
  controls_repeat_ext:2,
  controls_if:2,
  math_number:2,
  logic_boolean:2,
  math_arithmetic:3,
  math_on_list_10k:4,
  logic_compare_10k:2,
  count:2,
  inicializarCubilete:3,
  tirarDado:3,
  verificarPuntaje:10,
  anotarPuntos:10
};

Juego.acciones = [
  'crearTabla', 'acumularPuntos', 'jugarRonda', 'puntajeRonda',
  'tirarCubilete','dadosArrojados',
  'puntosParaDados','hay10Mil','noHay10Mil','puntosRonda','puntosRondaFix', 'puntosJugadores',
  'crearContador', 'incrementarContador', 'contador',
  'decir'
];

Mila.generador.header = 'var var_dados = undefined;\n';

Mila.generador.listaVacia = function(bloque) {
  return ["[]",0];
};

Mila.generador.listaDeCeros = function(bloque) {
  let k = bloque.getFieldValue("K");
  let v = [];
  for (let i=0; i<k; i++) {
    v.push("0");
  }
  return [`[${v.join(",")}]`,0];
};

Mila.generador.listaDeCerosFix = function(bloque) {
  return ["[0,0,0,0]",0];
};

const JsVariablesSet = Blockly.JavaScript['variables_set'];
Mila.generador.variables_set = function(bloque) {
  let v = Blockly.JavaScript.variableDB_.getName(bloque.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  let n = bloque.getField('VAR').getText();
  return JsVariablesSet(bloque) + `variables_set({n:"${n}",valor:${v}});\n`;
};

Mila.generador.list_assign_var = function(bloque) {
  let v = Blockly.JavaScript.variableDB_.getName(bloque.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  let n = bloque.getField('VAR').getText();
  let pos = Mila.generador.valueToCode(bloque, "POS", 0);
  let val = Mila.generador.valueToCode(bloque, "X", 0);
  return `${v}[${pos}] = ${val};\nlist_assign({v:${v},p:${pos},n:"${n}",valor:${val}});\n`;
};

Mila.generador.list_push_var = function(bloque) {
  let v = Blockly.JavaScript.variableDB_.getName(bloque.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  let val = Mila.generador.valueToCode(bloque, "X", 0);
  return `${v}.push(${val});\n`;
};

Mila.generador.list_plus_list = function(bloque) {
  let l1 = Mila.generador.valueToCode(bloque, "A", 0);
  let l2 = Mila.generador.valueToCode(bloque, "B", 0);
  return [`list_plus_list({l1:${l1},l2:${l2}})`,0];
};

for (let a of Juego.acciones) {
  if (!(a in ['tirarCubilete'])) { // Casos especiales, no tienen función asociada
    Mila.generador.addReservedWords(a);
  }
  Mila.generador[a] = function(bloque){
    let args = Juego.argsBloque(bloque);
    if (a == 'dadosArrojados') {
      return [`(iluminar("${bloque.id}")||dadosArrojados()||var_dados)`,0];
    } else if (a == 'tirarCubilete') { // Caso especial porque tengo que actualizar var_dados
      return Juego.tirarCubilete();
    }
    let resultado = a + `(${args})`;
    if (['puntosRonda','puntosRondaFix'].includes(a)) {
      resultado = `(jugarRonda(${Juego.tamanioFijo=='S' ? 4 : bloque.getFieldValue("K")})||${resultado})`;
    }
    if (['puntosParaDados','hay10Mil','noHay10Mil','puntosRonda','puntosRondaFix','puntosJugadores','contador','puntajeRonda'].includes(a)) {
      resultado = [`(iluminar("${bloque.id}")||${resultado})`, 0];
    } else {
      resultado += ";\n";
    }
    return resultado;
  };
  Juego.tiemposBloque[a] =
    ['puntosRondaFix', 'jugarRonda'].includes(a)
    ? (bloque_o_args) => Juego.tiempos[Juego.JUGADA]*4
    : a === 'puntosRonda'
    ? (bloque_o_args) => {
      let k = (bloque_o_args instanceof Blockly.BlockSvg) ? bloque_o_args.getFieldValue("K") : bloque_o_args;
      return Juego.tiempos[Juego.JUGADA]*k;
    }
    : 10
  ;
}

// Adicionales para los casos especiales
for (let a of ['inicializarCubilete', 'tirarDado', 'list_assign', 'list_plus_list', 'variables_set']) {
  Juego.acciones.push(a);
  Mila.generador.addReservedWords(a);
}

Mila.generador.count = function(bloque){
  const elem = Mila.generador.valueToCode(bloque, "ELEM", 0);
  const list = Mila.generador.valueToCode(bloque, "LIST", 0);
  return [`${list}.reduce((rec,x) => rec + (x == ${elem} ? 1 : 0), 0)`,0];
};

Juego.argsBloque = function(bloque) {
  if (['puntosParaDados','decir','hay10Mil'].includes(bloque.type)) {
    return Mila.generador.valueToCode(bloque, "X", 0);
  }
  if (['puntosRonda'].includes(bloque.type)) {
    return bloque.getFieldValue("K");
  }
  if (['acumularPuntos'].includes(bloque.type)) {
    return `{a:${Mila.generador.valueToCode(bloque, "A", 0)},b:${Mila.generador.valueToCode(bloque, "B", 0)}}`;
  }
  return '';
}

// Inicializa todo lo necesario antes de que se termine de cargar la página
Juego.preCarga = function() {
  Juego.tamanioFijo = Mila.argumentoURL('fix') || 'S'; // 'N' o 'S'
  Mila.agregarScriptFuente(`src/juegos/10k/bloques.js`);
  Mila.agregarScriptFuente('src/lib/seedrandom.js');
  for (let i=1; i<=6; i++) {
    Mila.agregarImagenFuenteLocal(`10k/${i}.png`, `dado${i}`);
  }
  Mila.agregarImagenFuenteLocal(`10k/cubilete.png`, 'cubilete');
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
    dados: [],
    cubilete: Canvas.nuevoObjeto({imagen:'cubilete', x:250, y:70, scale:.75}),
    variables:{}
  };
  let y=400;
  for (let v of Blockly.getMainWorkspace().getAllVariableNames()) {
    Juego.elementos.variables[v] = Canvas.nuevoObjeto({texto:`${v} : -`, x:10, y});
    y += 30;
  }
  Math.seedrandom('nombreJugador' in Juego ? Juego.nombreJugador : Math.random());
}

// Detiene el juego
Juego.detener = function() {
  for (robot of Juego.robots) {
    clearInterval(robot.intervalo); // Si había un movimiento programado, lo anulo
  }
  delete Juego.animacion; // Si había una animación en progreso, la anulo
};

// Ordena el movimiento de un robot en el mapa
Juego.mover = function(robot, direccion, args) {
  let i, n, valor;
  switch (direccion) {
    case 'tirarCubilete':
      break; // Caso especial porque tengo que actualizar var_dados
    case 'dadosArrojados':
      if (!('dados' in Juego.elementos)) {
        alert("Todavía no arrojaste los dados");
        Mila.detener();
        break;
      }
      return undefined;
      break;
    case 'crearTabla':
      if (!('tabla' in Juego.elementos)) {
        Canvas.nuevoObjeto({texto:'Puntajes acumulados:', x:10, y:440});
        Juego.elementos.tabla = [];
        for (let i=1; i<=4; i++) {
          Juego.elementos.tabla.push(Canvas.nuevoObjeto({texto:`J${i}: 0`, x:30, y:440+30*i, v:0}));
        }
      }
      break;
    case 'puntosParaDados':
      if (args === undefined) { return 0; }
      return Juego.puntosParaDados(args);
      break;
    case 'hay10Mil':
      return (args || []).some((x) => x >= 10000);
      break;
    case 'noHay10Mil':
      if (!('tabla' in Juego.elementos)) {
        alert("Todavía no creaste la lista de puntajes acumulados");
        Mila.detener();
        break;
      }
      return !Juego.elementos.tabla.map((x)=>x.v).some((x) => x >= 10000);
      break;
    case 'puntosRonda':
      return Juego.puntosParaRonda();
      break;
    case 'puntosRondaFix':
      return Juego.puntosParaRonda();
      break;
    case 'puntajeRonda':
      if (!('rondaActual') in Juego) {
        alert("Todavía no jugaste ninguna ronda");
        Mila.detener();
        break;
      }
      return Juego.rondaActual.puntos;
      break;
    case 'puntosJugadores':
      if (!('tabla' in Juego.elementos)) {
        alert("Todavía no creaste la lista de puntajes acumulados");
        Mila.detener();
        break;
      }
      return Juego.elementos.tabla.map((x)=>x.v);
      break;
    case 'acumularPuntos':
      let a = args.a || [];
      let b = args.b || [];
      if (a.length != b.length) {
        alert(`No se pueden acumular las listas ${a} y ${b} porque tienen tamaños distintos`);
        Mila.detener();
        break;
      }
      for (let i=0; i<Juego.elementos.tabla.length; i++) {
        Juego.elementos.tabla[i].del = true;
      }
      Juego.elementos.tabla = [];
      for (let i=1; i<=a.length; i++) {
        let n = a[i-1]+b[i-1];
        Juego.elementos.tabla.push(Canvas.nuevoObjeto({texto:`J${i}: ${n}`, x:30, y:440+30*i, v:n}));
      }
      break;
    case 'crearContador':
      if (!('contador' in Juego.elementos)) {
        Canvas.nuevoObjeto({texto: 'Contador: ', x:10, y:400});
        Juego.elementos.contador = Canvas.nuevoObjeto({texto:"0", x:120, y:400, v:0})
      }
      break;
    case 'incrementarContador':
      if (!('contador' in Juego.elementos)) {
        alert("Todavía no creaste el contador de rondas");
        Mila.detener();
        break;
      }
      Juego.elementos.contador.v = Juego.elementos.contador.v+1;
      Juego.elementos.contador.texto = `${Juego.elementos.contador.v}`;
      break;
    case 'contador':
      if (!('contador' in Juego.elementos)) {
        alert("Todavía no creaste el contador de rondas");
        Mila.detener();
        break;
      }
      return Juego.elementos.contador.v;
      break;
    case 'decir':
      alert(args === undefined ? '?' : args);
      break;
    case 'jugarRonda':
      let k = (args === undefined ? 4 : args);
      Juego.rondaActual = {
        jugadores: k,
        puntos: []
      };
      Juego.tiempos[Juego.RONDA] = Juego.tiempos[Juego.JUGADA]*k;
      Juego.animacion = {
        k:Juego.RONDA,
        t:0
      };
      return undefined;
      break;
    // Adicionales para los casos especiales
    case 'inicializarCubilete':
      Juego.inicializarCubilete();
      break;
    case 'tirarDado':
      return Juego.tirarDado();
      break;
    case 'variables_set':
      n = args.n;
      valor = args.valor;
      Juego.elementos.variables[n].valor = valor;
      Juego.elementos.variables[n].texto = `${n} : ${valor}`;
      break;
    case 'list_assign':
      let pos = args.p;
      let list_len = args.v.length;
      if (pos >= list_len) {
        alert(`No podés asignar la posición ${pos} porque la lista tiene tamaño ${list_len}`);
        Mila.detener();
        return false;
      }
      n = args.n;
      valor = args.valor;
      let valorAnterior = Juego.elementos.variables[n].valor;
      valorAnterior[pos] = valor;
      Juego.elementos.variables[n].texto = `${n} : ${valorAnterior}`;
      return true;
      break;
    case 'list_plus_list':
      let l1 = args.l1;
      let l2 = args.l2;
      if (l1.length == l2.length) {
        let l3 = [];
        for (let i=0; i<l1.length; i++) {
          l3.push(l1[i] + l2[i]);
        }
        return l3;
      } else {
        alert(`No podés sumar las listas ${l1} y ${l2} porque tienen tamaños distintos`);
        Mila.detener();
        return [];
      }
      break;
    default:
      //
  }
};

Juego.tirarCubilete = function() {
  let resultado = 'inicializarCubilete();\nvar_dados = [];\n';
  resultado += 'for (var i=0; i<5; i++) {\n  var_dados.push(tirarDado());\n}\n';
  return resultado;
};

Juego.puntosParaRonda = function() {
  return Juego.rondaActual.puntos;
};

Juego.inicializarCubilete = function() {
  Juego.elementos.cubilete.rot = 0;
  Juego.elementos.cubilete.y = 10;
  for (let dado of Juego.elementos.dados) {
    dado.del = true;
  }
  Juego.elementos.dados = [];
};

Juego.tirarDado = function() {
  let i = Juego.elementos.dados.length;
  let dado = 1+Math.floor(Math.random()*6);
  let rot = Math.floor(Math.random()*360);
  let x = posicionesDados[i].x + Math.floor(Math.random()*30);
  let y = posicionesDados[i].y + Math.floor(Math.random()*30);
  Juego.elementos.dados.push(Canvas.nuevoObjeto({imagen:`dado${dado}`, x, y, scale:.4, rot, val:dado}));
  return dado;
};

Juego.puntosParaDados = function(dados) {
  let cantUnos = dados.reduce((rec,x) => rec + (x == 1 ? 1 : 0), 0);
  let cantCincos = dados.reduce((rec,x) => rec + (x == 5 ? 1 : 0), 0);
  let puntos = cantUnos*100 + cantCincos*50;
  if (cantUnos == 3) {
    puntos += 1000;
  } else if (cantUnos == 4) {
    puntos += 1100;
  } else if (cantUnos == 5) {
    puntos += 10000;
  }
  if (cantCincos == 3) {
    puntos += 500;
  } else if (cantCincos == 4) {
    puntos += 550;
  } else if (cantCincos == 5) {
    puntos += 600;
  }
  return puntos;
};

Juego.roles = function() {
  return [
    ["Programa", "AUTO"]
  ];
};

Juego.tiempos = {
  [Juego.CUBILETE]:25,
  [Juego.DADO]:15,
  [Juego.DELAY]:20
};

Juego.tiempos[Juego.JUGADA] = Juego.tiempos[Juego.CUBILETE] + 5*Juego.tiempos[Juego.DADO] + Juego.tiempos[Juego.DELAY];

Juego.paso = function() {
  if ('animacion' in Juego) {
    let tLocal = Juego.animacion.t;
    let animacion = Juego.animacion.k;
    let tFin = Juego.tiempos[animacion];
    if (animacion == Juego.RONDA) {
      tLocal = tLocal % Juego.tiempos[Juego.JUGADA];
      animacion = tLocal < Juego.tiempos[Juego.CUBILETE]
        ? Juego.CUBILETE
        : tLocal < Juego.tiempos[Juego.CUBILETE] + 5*Juego.tiempos[Juego.DADO]
        ? Juego.DADO
        : Juego.DELAY
      ;
      if (tLocal == Juego.tiempos[Juego.JUGADA] -1) { // Terminó una jugada
        Juego.rondaActual.puntos.push(Juego.elementos.puntosJugada.texto);
      }
      if (animacion == Juego.DADO) {
        tLocal = (tLocal-Juego.tiempos[Juego.CUBILETE]) % Juego.tiempos[Juego.DADO];
      } else if (animacion == Juego.DELAY) {
        tLocal -= (Juego.tiempos[Juego.CUBILETE] + 5*Juego.tiempos[Juego.DADO]);
      }
    }
    switch (animacion) {
      case Juego.CUBILETE:
        if (tLocal == 0) {
          Juego.inicializarCubilete();
        } else if (tLocal == Juego.tiempos[Juego.CUBILETE]-1) {
          Juego.elementos.cubilete.rot = 225;
          Juego.elementos.cubilete.y = -20;
        } else {
          Juego.elementos.cubilete.y = 70 + 15*Math.sin(tLocal);
        }
        break;
      case Juego.DADO:
        if (tLocal == 0) {
          Juego.tirarDado();
        } else if (tLocal == Juego.tiempos[Juego.DADO]-1) {
          Juego.elementos.dados[Juego.elementos.dados.length-1].imagen =
            `dado${Juego.elementos.dados[Juego.elementos.dados.length-1].val}`
          ;
        } else {
          /*if (tLocal % 7 == 0) {
            Juego.elementos.dados[Juego.elementos.dados.length-1].imagen =
              `dado${1+Math.floor(Math.random()*6)}`
            ;
          }*/
          Juego.elementos.dados[Juego.elementos.dados.length-1].rot -= 10 / (tLocal/2.0 + 1);//Math.max(0,14-14*Math.pow(1.0*tLocal/Juego.tiempos[Juego.DADO],5));
        }
        break;
      case Juego.DELAY:
        if (tLocal == 0) {
          let puntos = Juego.puntosParaDados(Juego.elementos.dados.map(x => x.val));
          Juego.elementos.puntosJugada = Canvas.nuevoObjeto(
            {texto:puntos, x:100, y:100, val:puntos}
          );
        } else if (tLocal == Juego.tiempos[Juego.DELAY]-1) {
          Juego.elementos.puntosJugada.del = true;
        } else {
          Juego.elementos.puntosJugada.y -= 1;
        }
      default:
        break;
    }
    Juego.animacion.t ++;
    if (tLocal == tFin) { // Terminó la animación
      delete Juego.animacion;
    }
  }
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

Blockly.JavaScript['math_on_list_10k'] = function(block) {
  // Math functions for lists.
  var func = block.getFieldValue('OP');
  var list, code;
  switch (func) {
    case 'SUM':
      list = Blockly.JavaScript.valueToCode(block, 'LIST',
          Blockly.JavaScript.ORDER_MEMBER) || '[]';
      code = list + '.reduce(function(x, y) {return x + y;})';
      break;
    case 'MIN':
      list = Blockly.JavaScript.valueToCode(block, 'LIST',
          Blockly.JavaScript.ORDER_COMMA) || '[]';
      code = 'Math.min.apply(null, ' + list + ')';
      break;
    case 'MAX':
      list = Blockly.JavaScript.valueToCode(block, 'LIST',
          Blockly.JavaScript.ORDER_COMMA) || '[]';
      code = 'Math.max.apply(null, ' + list + ')';
      break;
    case 'AVERAGE':
      // mathMean([null,null,1,3]) == 2.0.
      var functionName = Blockly.JavaScript.provideFunction_(
          'mathMean',
          ['function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
              '(myList) {',
            '  return myList.reduce(function(x, y) {return x + y;}) / ' +
                  'myList.length;',
            '}']);
      list = Blockly.JavaScript.valueToCode(block, 'LIST',
          Blockly.JavaScript.ORDER_NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
      default:
        throw Error('Unknown operator: ' + func);
    }
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

Blockly.JavaScript['logic_compare_10k'] = Blockly.JavaScript['logic_compare'];