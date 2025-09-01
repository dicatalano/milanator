// Lee parámetros de la URL (ej: ?juego=10k)
const params = new URLSearchParams(window.location.search);
const juego = params.get("juego");

const contenido = document.getElementById("contenido");

if (juego) {
  contenido.innerHTML = `<p>Estás jugando: <strong>${juego}</strong></p>`;
} else {
  contenido.innerHTML = "<p>No elegiste ningún juego.</p>";
}
