// Toolbox para el juego Diez mil
Juego.toolbox =
  '<xml>\
      <category name="Puntajes">\
      <!--block type="puntosParaDados"></block-->\
      <block type="hay10Mil"></block>\
      <block type="puntosRonda'+
        (Juego.tamanioFijo=='S'?'Fix"':'"><field name="K">4</field')+
      '></block>\
    </category>\
    <category name="Variables">\
      <block type="variables_set"></block>\
      <block type="variables_get"></block>\
    </category>\
    <category name="Listas">\
      <block type="listaVacia"></block>\
      <block type="listaDeCeros'+
      (Juego.tamanioFijo=='S'?'Fix"':'"><field name="K">4</field')+
      '></block>\
      <block type="list_push_var"></block>\
      <block type="list_assign_var"></block>\
    </category>\
    <category name="Funciones" custom="PROCEDURE"></category>\
    <category name="Control">\
      <block type="controls_repeat_ext"></block>\
      <block type="controls_whileUntil"></block>\
      <block type="controls_if"></block>\
    </category>\
    <category name="Valores">\
      <block type="math_number"></block>\
      <block type="logic_boolean"></block>\
    </category>\
    <category name="Operaciones">\
    <block type="math_arithmetic"></block>\
    <block type="logic_compare_10k"></block>\
    <block type="logic_negate"></block>\
    <block type="math_on_list_10k"></block>\
    <block type="list_plus_list"></block>\
    <block type="count"></block>\
    <block type="decir"></block>\
    </category>\
  </xml>';
