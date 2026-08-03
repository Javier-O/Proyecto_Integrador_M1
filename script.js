// ======================================================
// GENERADOR DE PALETAS DE COLOR
// ======================================================

// 1. Obtenemos referencias a los elementos del HTML que vamos a usar
const btnGenerar = document.getElementById("btnGenerar");
const selectTamano = document.getElementById("tamano");
const selectFormato = document.getElementById("formato");
const contenedorPaleta = document.getElementById("paleta");

// ------------------------------------------------------
// 2. Función para generar UN color aleatorio en formato HSL
//    HSL = Hue (0-360), Saturation (%), Lightness (%)
// ------------------------------------------------------
function generarColorHSL() {
  const h = Math.floor(Math.random() * 361); // matiz: 0 a 360
  const s = Math.floor(Math.random() * 41) + 60; // saturación: 60% a 100% (colores más vivos)
  const l = Math.floor(Math.random() * 31) + 40; // luminosidad: 40% a 70% (evita negros/blancos)

  return { h, s, l };
}

// ------------------------------------------------------
// 3. Función para convertir un color HSL a formato HEX
//    Esto nos permite cumplir con generar en HSL Y mostrar en HEX
// ------------------------------------------------------
function hslToHex(h, s, l) {
  // Pasamos saturación y luminosidad de porcentaje (0-100) a fracción (0-1)
  s /= 100;
  l /= 100;

  // Fórmula estándar de conversión HSL -> RGB
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120)  { r = x; g = c; b = 0; }
  else if (h < 180)  { r = 0; g = c; b = x; }
  else if (h < 240)  { r = 0; g = x; b = c; }
  else if (h < 300)  { r = x; g = 0; b = c; }
  else               { r = c; g = 0; b = x; }

  // Pasamos cada valor RGB de 0-1 a 0-255
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  // Convertimos cada número a hexadecimal de 2 dígitos y los unimos
  const toHex = (valor) => valor.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// ------------------------------------------------------
// 4. Función que crea la tarjeta visual (HTML) de un color
// ------------------------------------------------------
function crearTarjetaColor(colorHSL) {
  const { h, s, l } = colorHSL;

  // Convertimos a HEX porque siempre debemos mostrar el código HEX
  const colorHex = hslToHex(h, s, l);

  // Texto que se mostrará según el formato elegido por el usuario
  const formatoElegido = selectFormato.value;
  const textoCodigo = formatoElegido === "hex"
    ? colorHex
    : `hsl(${h}, ${s}%, ${l}%)`;

  // Creamos los elementos HTML con JavaScript
  const tarjeta = document.createElement("article"); // "article" porque cada color es una unidad independiente
  tarjeta.classList.add("color-card");

  const muestra = document.createElement("div");
  muestra.classList.add("color-muestra");
  muestra.style.backgroundColor = colorHex; // el color de fondo siempre se aplica con el HEX

  const codigo = document.createElement("p");
  codigo.classList.add("color-codigo");
  codigo.textContent = textoCodigo;

  // Armamos la tarjeta: muestra de color + texto del código
  tarjeta.appendChild(muestra);
  tarjeta.appendChild(codigo);

  return tarjeta;
}

// ------------------------------------------------------
// 5. Función principal: genera la paleta completa
// ------------------------------------------------------
function generarPaleta() {
  // Limpiamos la paleta anterior antes de generar una nueva
  contenedorPaleta.innerHTML = "";

  // Leemos cuántos colores debe tener la paleta (viene como texto, lo convertimos a número)
  const cantidadColores = parseInt(selectTamano.value);

  // Usamos un for para generar cada color, uno por uno
  for (let i = 0; i < cantidadColores; i++) {
    const nuevoColor = generarColorHSL();
    const tarjeta = crearTarjetaColor(nuevoColor);
    contenedorPaleta.appendChild(tarjeta);
  }
}

// ------------------------------------------------------
// 6. Escuchamos el clic del botón para generar la paleta
// ------------------------------------------------------
btnGenerar.addEventListener("click", generarPaleta);

// 7. Generamos una paleta inicial apenas carga la página (opcional, pero se ve mejor)
generarPaleta();