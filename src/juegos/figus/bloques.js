/**

  Bloques para el juego Figus
    crearAlbum
    faltaFiguEnÁlbum
    comprarFigu
    pegarFigu
    crearContador
    incrementarContador

**/

Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
  { // Crear álbum
    "type": "crearAlbum",
    "message0": "Crear álbum vacío",
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Crear álbum variable
    "type": "crearAlbumX",
    "message0": "Crear álbum vacío para %1 figus",
    "args0": [{
      "type":"input_value",
      "name":"X",
      "check":"Number"
    }],
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Falta figu en álbum
    "type": "faltaFiguEnÁlbum",
    "message0": "falta figu en álbum",
    "style": "colour_blocks",
    "output":"Boolean"
  },{ // Álbum
    "type": "album",
    "message0": "álbum",
    "style": "colour_blocks",
    "output":"Array"
  },{ // Comprar figu
    "type": "comprarFigu",
    "message0": "Comprar figu",
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Pegar figu
    "type": "pegarFigu",
    "message0": "Pegar figu",
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Figu actual
    "type": "figuActual",
    "message0": "figuActual",
    "style": "colour_blocks",
    "output":"Number"
  },{ // Crear contador
    "type": "crearContador",
    "message0": "Crear contador",
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Incrementar contador
    "type": "incrementarContador",
    "message0": "Incrementar contador",
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Contador
    "type": "contador",
    "message0": "contador",
    "style": "colour_blocks",
    "output":"Number"
  },{ // Crear anotador
    "type": "crearAnotador",
    "message0": "Crear anotador",
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Anotar
    "type": "anotar",
    "message0": "Anotar %1",
    "args0": [{
      "type":"input_value",
      "name":"X",
      "check":"Number"
    }],
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Anotador
    "type": "anotador",
    "message0": "anotaciones",
    "style": "colour_blocks",
    "output":"Array"
  },{ // Imprimir resultado
    "type": "decir",
    "message0": "Decir %1",
    "args0": [{
      "type":"input_value",
      "name":"X"
    }],
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Asignar variable
    "type": "var_assign",
    "message0": "Asignar a %1 el valor %2",
    "args0": [{
      "type": "field_dropdown",
      "name": "VAR",
      "options": [
        ["álbum", "var_album"],
        ["figuActual", "var_figuActual"],
        ["contador", "var_contador"],
        ["anotaciones", "var_anotador"]
      ]
    },{
      "type":"input_value",
      "name":"X"
    }],
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Asignar posición lista
    "type": "list_assign",
    "message0": "Asignar a la posición %1 de %2 el valor %3",
    "args0": [{
      "type":"input_value",
      "name":"POS",
      "check":"Number"
    },{
      "type": "field_dropdown",
      "name": "VAR",
      "options": [
        ["álbum", "var_album"],
        ["anotaciones", "var_anotador"]
      ]
    },{
      "type":"input_value",
      "name":"X"
    }],
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Agregar en lista
    "type": "list_push",
    "message0": "Agregar %1 al final de %2",
    "args0": [{
      "type":"input_value",
      "name":"X"
    },{
      "type": "field_dropdown",
      "name": "VAR",
      "options": [
        ["álbum", "var_album"],
        ["anotaciones", "var_anotador"]
      ]
    }],
    "style": "colour_blocks",
    "previousStatement":true,
    "nextStatement":true
  },{ // Lista vacía
    "type": "listaVacia",
    "message0": "lista vacía",
    "style": "colour_blocks",
    "output":"Array"
  },{ // Lista con 6 ceros
    "type": "lista6Ceros",
    "message0": "lista con 6 ceros",
    "style": "colour_blocks",
    "output":"Array"
  },{ // Comparación
    "type": "logic_compare_figus",
    "message0": "%1 %2 %3",
    "args0": [
      {
        "type": "input_value",
        "name": "A"
      },
      {
        "type": "field_dropdown",
        "name": "OP",
        "options": [
          ["es igual a", "EQ"],
          ["es menor a", "LT"],
          ["es mayor a", "GT"]
        ]
      },
      {
        "type": "input_value",
        "name": "B"
      }
    ],
    "inputsInline": true,
    "output": "Boolean",
    "style": "logic_blocks",
    "helpUrl": "%{BKY_LOGIC_COMPARE_HELPURL}",
    "extensions": ["logic_compare", "logic_op_tooltip"]
  },{ // Operación sobre lista
    "type": "math_on_list_figus",
    "message0": "%1 %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "OP",
        "options": [
          ["suma de", "SUM"],
          ["producto de", "PROD"],
          ["promedio de", "AVERAGE"]
        ]
      },
      {
        "type": "input_value",
        "name": "X",
        "check": "Array"
      }
    ],
    "output": "Number",
    "style": "math_blocks",
    "helpUrl": "%{BKY_MATH_ONLIST_HELPURL}"
  }
]);  // END JSON EXTRACT (Do not delete this comment.)
