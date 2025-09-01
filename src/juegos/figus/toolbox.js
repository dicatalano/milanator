// Toolbox para el juego Figus
Juego.toolbox =
  '<xml>\
    <category name="Álbum">\
      <block type="crearAlbum'+(Juego.tamanioFijo=='N'?'X':'')+'"></block>\
      <block type="faltaFiguEnÁlbum"></block>\
    </category>\
    <category name="Figus">\
      <block type="comprarFigu"></block>\
      <block type="pegarFigu"></block>\
    </category>\
    <category name="Contador">\
      <block type="crearContador"></block>\
      <block type="incrementarContador"></block>\
      <block type="contador"></block>\
    </category>\
    <category name="Anotador">\
      <block type="crearAnotador"></block>\
      <block type="anotar"></block>\
      <block type="anotador"></block>\
    </category>\
    <category name="Funciones" custom="PROCEDURE"></category>\
    <category name="Control">\
      <block type="controls_repeat_ext"></block>\
      <block type="controls_whileUntil"></block>\
    </category>\
    <category name="Valores">\
      <block type="math_number"></block>\
      <block type="logic_boolean"></block>\
    </category>\
    <category name="Operaciones">\
      <block type="logic_compare_figus"></block>\
      <block type="math_on_list_figus"></block>\
      <block type="decir"></block>\
    </category>\
  </xml>';
