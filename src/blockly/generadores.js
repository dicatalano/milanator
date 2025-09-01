/**

  BLOCKLY/GENERADOR

  Definición del generador propio basado en el de Javascript

**/

// Generador
Mila.generador = Blockly.JavaScript;

// Prefijo de sentencia para iluminar los bloques cuando se ejecutan
Mila.generador.STATEMENT_PREFIX = 'iluminar(%1);\n';

// Palabras reservadas (no pueden ser nombres de funciones ni variables)
Mila.generador.addReservedWords('iluminar');
Mila.generador.addReservedWords('derecha');
Mila.generador.addReservedWords('izquierda');
Mila.generador.addReservedWords('arriba');
Mila.generador.addReservedWords('abajo');

// Funciones generadoras
Mila.generador.derecha = function(bloque){
  return "derecha();\n";
};
Mila.generador.izquierda = function(bloque){
  return "izquierda();\n";
};
Mila.generador.arriba = function(bloque){
  return "arriba();\n";
};
Mila.generador.abajo = function(bloque){
  return "abajo();\n";
};
Mila.generador.robot_def = function(bloque){
  let branch = Mila.generador.statementToCode(bloque, 'CUERPO');
  let rol = bloque.getFieldValue('ROL');
  let codigo = 'function ' + rol + '() {\n' +
       branch + '}';
  Mila.generador.definitions_['%' + rol] = codigo;

  return null;
};

// Reemplazo el generador de la repetición simple
  // Es idéntico al de JavaScript pero comenté la optimización
  // que definía en otra sentencia la cantidad de repeticiones para que
  // los bloques interiores se iluminen en cada iteración.
Mila.generador['controls_repeat_ext'] = function(block) {
  // Repeat n times.
  if (block.getField('TIMES')) {
    // Internal number.
    var repeats = String(Number(block.getFieldValue('TIMES')));
  } else {
    // External number.
    var repeats = Blockly.JavaScript.valueToCode(block, 'TIMES',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  }
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block);
  var code = '';
  var loopVar = Blockly.JavaScript.variableDB_.getDistinctName(
      'count', Blockly.VARIABLE_CATEGORY_NAME);
  var endVar = repeats;
  /*if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
    endVar = Blockly.JavaScript.variableDB_.getDistinctName(
        'repeat_end', Blockly.VARIABLE_CATEGORY_NAME);
    code += 'var ' + endVar + ' = ' + repeats + ';\n';
  }*/
  code += 'for (var ' + loopVar + ' = 0; ' +
      loopVar + ' < ' + endVar + '; ' +
      loopVar + '++) {\n' +
      branch + '}\n';
  return code;
};
