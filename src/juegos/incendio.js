/**

  INCENDIO

  Juego para simular la propagación de un incendio en el bosque

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

const Juego = {};

Juego.tiemposBloque = {
  controls_whileUntil:2,
  controls_repeat_ext:2,
  controls_if: 2,
  math_number:2,
  logic_boolean:2,
  // math_on_list_figus:4,
  // logic_compare_figus:2
};

Juego.acciones = [
  'crearBosque',
  'moverEste', 'moverOeste', 'hayEste', 'hayOeste',
  'mover', 'hayLugar', 'direccion',
  'ponerArbol', 'ponerRayo', 'quemarArbol',
  'sacarRayo', 'sacarArbol',
  'poner', 'sacar', 'elemento',
  'hayArbol', 'hayRayo', 'arbolQuemado', 'elementoActual',
  'random'
];

// Mila.generador.header = 'var var_anotador = [];\n'

Juego.expresiones = ['direccion', 'elemento', 'random',
  'hayArbol', 'hayRayo', 'arbolQuemado', 'elementoActual',
  'hayEste', 'hayOeste', 'hayLugar'
];
Juego.bloquesConArgumentos = {
  'crearBosque':'X',
  'mover':'X',
  'hayLugar':'X',
  'poner':'X',
  'sacar':'X',
  'random':'X'
};

Juego.espacioEntreCeldas = 30;

for (let a of Juego.acciones) {
  Mila.generador.addReservedWords(a);
  Mila.generador[a] = function(bloque){
    let resultado = a + `(${Juego.argsBloque(bloque)})`;
    if (Juego.expresiones.includes(a)) {
      resultado = [resultado, 0];
    } else {
      resultado += ";\n";
    }
    return resultado;
  };
  Juego.tiemposBloque[a] = 4;
}

Juego.argsBloque = function(bloque) {
  const argumentos = Juego.bloquesConArgumentos[bloque.type];
  if (argumentos === null) {
    return '';
  }
  return Mila.generador.valueToCode(bloque, argumentos, 0);
}

// Inicializa todo lo necesario antes de que se termine de cargar la página
Juego.preCarga = function() {
  Mila.agregarScriptFuente(`src/juegos/incendio/bloques.js`);
  for (let i of ['celda','cursor','arbol','arbol-quemado','rayo']) {
    Mila.agregarImagenFuenteLocal(`incendio/${i}.png`, i);
  }
  Mila.agregarScriptFuente('src/lib/seedrandom.js');
};

Juego.layout = {dist:Layout.Horizontal};

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
    bosque: [],
  };
  // Canvas.nuevoObjeto({texto:"Nueva figu:", x:10, y:45});
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
    case 'crearBosque':
      if (Juego.elementos.bosque.length > 0) {
        for (let e of Juego.elementos.bosque) {
          for (let k in e) {
            e[k].del = true;
          }
        }
        Juego.elementos.bosque = [];
      } else {
        Canvas.nuevoObjeto({texto:"Bosque:", x:10, y:30});
      }
      const tamanio = Number.parseInt(args === undefined ? '0' : args);
      for (i=0; i<tamanio; i++) {
        let img = {imagen:'celda', x:Juego.espacioEntreCeldas*i, y:60, rot:0, scale:.3};
        Juego.elementos.bosque.push({a:img});
        Canvas.nuevoObjeto(img);
      }
      if (tamanio > 0) {
        Juego.elementos.cursor = {imagen:'cursor', x:0, y:110, rot:0, scale:.3, i:0};
        Canvas.nuevoObjeto(Juego.elementos.cursor);
      }
      break;
    case 'ponerArbol':
      if ('cursor' in Juego.elementos) {
        const cursor = Juego.elementos.cursor.i;
        if (Juego.elementos.bosque.length > cursor) {
          if ('b' in Juego.elementos.bosque[cursor]) {
            alert("Ya hay un árbol plantado acá");
            Mila.detener();
            break;
          }
          let img = {imagen:'arbol', x:Juego.espacioEntreCeldas*cursor, y:60, rot:0, scale:.3};
          Juego.elementos.bosque[cursor].b = img;
          Canvas.nuevoObjeto(img);
          break;
        }
      }
      alert("No se puede plantar un árbol fuera del bosque");
      Mila.detener();
      break;
    case 'ponerRayo':
      if ('cursor' in Juego.elementos) {
        const cursor = Juego.elementos.cursor.i;
        if (Juego.elementos.bosque.length > cursor) {
          if ('c' in Juego.elementos.bosque[cursor]) {
            alert("Ya hay un rayo acá");
            Mila.detener();
            break;
          }
          let img = {imagen:'rayo', x:Juego.espacioEntreCeldas*cursor, y:50, rot:0, scale:.3};
          Juego.elementos.bosque[cursor].c = img;
          Canvas.nuevoObjeto(img);
          break;
        }
      }
      alert("No se puede lanzar un rayo fuera del bosque");
      Mila.detener();
      break;
    case 'sacarArbol':
      if ('cursor' in Juego.elementos) {
        const cursor = Juego.elementos.cursor.i;
        if (Juego.elementos.bosque.length > cursor) {
          if ('b' in Juego.elementos.bosque[cursor]) {
            Juego.elementos.bosque[cursor].b.del = true;
            break;
          }
        }
      }
      alert("No hay un árbol acá");
      Mila.detener();
      break;
    case 'sacarRayo':
      if ('cursor' in Juego.elementos) {
        const cursor = Juego.elementos.cursor.i;
        if (Juego.elementos.bosque.length > cursor) {
          if ('c' in Juego.elementos.bosque[cursor]) {
            Juego.elementos.bosque[cursor].c.del = true;
            break;
          }
        }
      }
      alert("No hay un rayo acá");
      Mila.detener();
      break;
    case 'quemarArbol':
      if ('cursor' in Juego.elementos) {
        const cursor = Juego.elementos.cursor.i;
        if (Juego.elementos.bosque.length > cursor) {
          if ('b' in Juego.elementos.bosque[cursor]) {
            Juego.elementos.bosque[cursor].b.del = true;
            let img = {imagen:'arbol-quemado', x:Juego.espacioEntreCeldas*cursor, y:60, rot:0, scale:.3};
            Juego.elementos.bosque[cursor].b = img;
            Canvas.nuevoObjeto(img);
            break;
          }
        }
      }
      alert("No hay un árbol acá");
      Mila.detener();
      break;
    case 'moverEste':
      if ('cursor' in Juego.elementos) {
        const cursor = Juego.elementos.cursor;
        if (Juego.elementos.bosque.length > cursor.i+1) {
          cursor.i ++;
          cursor.x += Juego.espacioEntreCeldas;
          break;
        }
      }
      alert("No se puede mover más al Este");
      Mila.detener();
      break;
    case 'moverOeste':
      if ('cursor' in Juego.elementos) {
        const cursor = Juego.elementos.cursor;
        if (cursor.i > 0) {
          cursor.i --;
          cursor.x -= Juego.espacioEntreCeldas;
          break;
        }
      }
      alert("No se puede mover más al Oeste");
      Mila.detener();
      break;
    case 'random':
      return Math.random() < Number.parseFloat(args === undefined ? '1' : args);
      break;
    case 'hayArbol':
      if ('cursor' in Juego.elementos) {
        const cursor = Juego.elementos.cursor.i;
        if (Juego.elementos.bosque.length > cursor) {
          return 'b' in Juego.elementos.bosque[cursor];
        }
      }
      return false;
      break;
    case 'hayRayo':
      if ('cursor' in Juego.elementos) {
        const cursor = Juego.elementos.cursor.i;
        if (Juego.elementos.bosque.length > cursor) {
          return 'c' in Juego.elementos.bosque[cursor];
        }
      }
      return false;
      break;
    case 'arbolQuemado':
      if ('cursor' in Juego.elementos) {
        const cursor = Juego.elementos.cursor.i;
        if (Juego.elementos.bosque.length > cursor && 'b' in Juego.elementos.bosque[cursor]) {
          return Juego.elementos.bosque[cursor].b.imagen == 'arbol-quemado';
        }
      }
      alert("No hay un árbol acá");
      Mila.detener();
      break;
    case 'hayEste':
      if ('cursor' in Juego.elementos) {
        const cursor = Juego.elementos.cursor.i;
        return Juego.elementos.bosque.length > cursor+1;
      }
      return false;
      break;
    case 'hayOeste':
      if ('cursor' in Juego.elementos) {
        const cursor = Juego.elementos.cursor.i;
        return cursor > 0;
      }
      return false;
      break;


    /*case 'faltaFiguEnÁlbum':
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
      i = Math.floor(Math.random()*6);
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
      Juego.elementos.figuActual.x = 10+65*i;
      Juego.elementos.figuActual.y = 130;
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
        Canvas.nuevoObjeto({imagen:"nota", x:-5, y:255,scale:0.67});
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
        let a = {texto:(args === undefined ? '?' : args),
          x:10+50*(Math.floor(Juego.elementos.anotador.length % 8)),
          y:285 + 24*(Math.floor(Juego.elementos.anotador.length / 8))
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
      break;*/
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
