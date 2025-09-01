/**

  Diez mil 2

  Es igual que Diez mil pero con otro Toolbox

**/

Mila.agregarScriptFuente('src/juegos/10k.js');

window.addEventListener('load', function() {
  // jugarRonda deja de ser un bloque y pasa a ser parte de puntosRonda y puntosRondaFix
  Juego.tiemposBloque.jugarRonda = 0;
});