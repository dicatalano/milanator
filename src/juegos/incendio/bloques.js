/**

  Bloques para el juego Incendio
    crearBosque
    moverEste
    moverOeste
    hayEste
    hayOeste
    hayLugar
    mover
    direccion
    ponerArbol
    ponerRayo
    quemarArbol
    sacarRayo
    sacarArbol
    hayArbol
    hayRayo
    arbolQuemado
    poner
    sacar
    elemento
    elementoActual
    random
**/

Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
  { // Crear bosque
    "type": "crearBosque",
    "message0": "Crear bosque de tamaño %1",
    "args0": [{
      "type":"input_value",
      "name":"X",
      "check":"Number"
    }],
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Mover al Este
    "type": "moverEste",
    "message0": "Mover al Este",
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Mover al Oeste
    "type": "moverOeste",
    "message0": "Mover al Oeste",
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // hay Este
    "type": "hayEste",
    "message0": "hay lugar al Este",
    "style": "colour_blocks",
    "output":"Boolean"
  },{ // hay Oeste
    "type": "hayOeste",
    "message0": "hay lugar al Oeste",
    "style": "colour_blocks",
    "output":"Boolean"
  },{ // Mover
    "type": "mover",
    "message0": "Mover al %1",
    "args0": [{
      "type":"input_value",
      "name":"X",
      "check":"DIR"
    }],
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // hay Lugar
    "type": "hayLugar",
    "message0": "hay lugar al %1",
    "args0": [{
      "type":"input_value",
      "name":"X",
      "check":"DIR"
    }],
    "style": "colour_blocks",
    "output":"Boolean"
  },{ // Dirección
    "type": "direccion",
    "message0": "%1",
    "args0": [{
      "type": "field_dropdown",
      "name": "DIR",
      "options": [
        ["Este", "Este"],
        ["Oeste", "Oeste"]
      ]
    }],
    "style": "colour_blocks",
    "output":"DIR"
  },{ // Poner Árbol
    "type": "ponerArbol",
    "message0": "Plantar árbol",
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Poner Rayo
    "type": "ponerRayo",
    "message0": "Lanzar rayo",
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Quemar Árbol
    "type": "quemarArbol",
    "message0": "Quemar árbol",
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Sacar Árbol
    "type": "sacarArbol",
    "message0": "Sacar árbol",
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Sacar Rayo
    "type": "sacarRayo",
    "message0": "Sacar rayo",
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // hay Árbol
    "type": "hayArbol",
    "message0": "hay árbol",
    "style": "colour_blocks",
    "output":"Boolean"
  },{ // hay Rayo
    "type": "hayRayo",
    "message0": "hay rayo",
    "style": "colour_blocks",
    "output":"Boolean"
  },{ // árbol quemado
    "type": "arbolQuemado",
    "message0": "el árbol está quemado",
    "style": "colour_blocks",
    "output":"Boolean"
  },{ // Poner
    "type": "poner",
    "message0": "Poner %1",
    "args0": [{
      "type":"input_value",
      "name":"X",
      "check":"ELEM"
    }],
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Sacar
    "type": "sacar",
    "message0": "Sacar %1",
    "args0": [{
      "type":"input_value",
      "name":"X",
      "check":"ELEM"
    }],
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Elemento
    "type": "elemento",
    "message0": "%1",
    "args0": [{
      "type": "field_dropdown",
      "name": "ELEM",
      "options": [
        ["árbol", "arbol"],
        ["árbol quemado", "arbolQuemado"],
        ["rayo", "rayo"]
      ]
    }],
    "style": "colour_blocks",
    "output":"ELEM"
  },{ // Elemento actual
    "type": "elementoActual",
    "message0": "elemento actual",
    "style": "colour_blocks",
    "output":"ELEM"
  },{ // Random
    "type": "random",
    "message0": "1 con probabilidad %1",
    "args0": [{
      "type":"input_value",
      "name":"X",
      "check":"Number"
    }],
    "style": "colour_blocks",
    "output":"Boolean"
  }
]);  // END JSON EXTRACT (Do not delete this comment.)
