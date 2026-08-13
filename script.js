// ======================================================
// GENERADOR DE PALETAS DE COLOR
// ======================================================

// 1. Obtenemos referencias a los elementos del HTML que vamos a usar
const btnGenerar = document.getElementById("btnGenerar");
const btnGuardar = document.getElementById("btnGuardar");
const selectTamano = document.getElementById("tamano");
const selectFormato = document.getElementById("formato");
const contenedorPaleta = document.getElementById("paleta");
const contenedorGuardadas = document.getElementById("listaGuardadas");
const toast = document.getElementById("toast");

// Variable para controlar el temporizador del toast (evita que se traslapen mensajes)
let temporizadorToast = null;

// Guardamos aquí la paleta que se está mostrando actualmente.
// Cada color es un objeto: { h, s, l, bloqueado }
// La necesitamos como variable "global" porque varias funciones la usan:
// generar, bloquear, guardar, etc.
let paletaActual = [];

// Clave que vamos a usar para guardar/leer en localStorage
const CLAVE_LOCALSTORAGE = "paletasGuardadas";

// ------------------------------------------------------
// 2. Función para generar UN color aleatorio en formato HSL
//    HSL = Hue (0-360), Saturation (%), Lightness (%)
// ------------------------------------------------------
function generarColorHSL() {
  const h = Math.floor(Math.random() * 361); // matiz: 0 a 360
  const s = Math.floor(Math.random() * 41) + 60; // saturación: 60% a 100% (colores más vivos)
  const l = Math.floor(Math.random() * 31) + 40; // luminosidad: 40% a 70% (evita negros/blancos)

  // "bloqueado" empieza en false: un color recién generado nunca está bloqueado
  return { h, s, l, bloqueado: false };
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

// Toast: microfeedback visible reutilizable en toda la página
function mostrarToast(mensaje) {
  if (temporizadorToast) {
    clearTimeout(temporizadorToast);
  }

  toast.textContent = mensaje;
  toast.classList.add("visible");

  temporizadorToast = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2000); // se oculta después de 2 segundos
}
// ------------------------------------------------------
// 4. Copiar un código HEX al portapapeles
//    Recibe el texto a copiar y el <p> donde mostramos feedback visual
// ------------------------------------------------------
function copiarAlPortapapeles(colorHex, elementoCodigo) {
  navigator.clipboard.writeText(colorHex).then(() => {
    // Guardamos el texto original para regresarlo después
    const textoOriginal = elementoCodigo.textContent;

    elementoCodigo.textContent = "¡Copiado!";
    elementoCodigo.classList.add("copiado");

    // Después de 1 segundo, regresamos el texto y el estilo a la normalidad
    setTimeout(() => {
      elementoCodigo.textContent = textoOriginal;
      elementoCodigo.classList.remove("copiado");
    }, 1000);
  });
}

// ------------------------------------------------------
// 5. Función que crea la tarjeta visual (HTML) de un color
//    Recibe el color y su índice (posición) dentro de la paleta
// ------------------------------------------------------
function crearTarjetaColor(color, index) {
  const { h, s, l, bloqueado } = color;

  // Convertimos a HEX porque siempre debemos mostrar/copiar el código HEX
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

  // --- Botón de candado (bloquear/desbloquear este color) ---
  const btnCandado = document.createElement("button");
  btnCandado.classList.add("btn-candado");
  btnCandado.textContent = bloqueado ? "🔒" : "🔓";
  if (bloqueado) {
    btnCandado.classList.add("bloqueado");
  }

  // Al hacer clic en el candado, solo cambiamos el bloqueo de ESTE color
  btnCandado.addEventListener("click", (evento) => {
    // stopPropagation evita que el clic "se propague" a la tarjeta
    // y dispare también la función de copiar al portapapeles
    evento.stopPropagation();
    paletaActual[index].bloqueado = !paletaActual[index].bloqueado;
    renderizarPaleta(); // volvemos a dibujar la paleta con el nuevo estado
  });

  muestra.appendChild(btnCandado);

  const codigo = document.createElement("p");
  codigo.classList.add("color-codigo");
  codigo.textContent = textoCodigo;

  // Al hacer clic en cualquier parte de la tarjeta, copiamos el HEX
  tarjeta.addEventListener("click", () => {
    copiarAlPortapapeles(colorHex, codigo);
  });

  // Armamos la tarjeta: muestra de color (con candado adentro) + código
  tarjeta.appendChild(muestra);
  tarjeta.appendChild(codigo);

  return tarjeta;
}

// ------------------------------------------------------
// 6. Dibuja en pantalla la paleta que esté guardada en "paletaActual"
//    (No genera colores nuevos, solo pinta lo que ya existe)
// ------------------------------------------------------
function renderizarPaleta() {
  contenedorPaleta.innerHTML = "";

  paletaActual.forEach((color, index) => {
    const tarjeta = crearTarjetaColor(color, index);
    contenedorPaleta.appendChild(tarjeta);
  });
}

// ------------------------------------------------------
// 7. Función principal: genera la paleta completa
//    Respeta los colores que estén bloqueados
// ------------------------------------------------------
function generarPaleta() {
  const cantidadColores = parseInt(selectTamano.value);

  const nuevaPaleta = [];
  let huboColorBloqueado = false; // <-- NUEVO: variable para saber si conservamos algún color

  for (let i = 0; i < cantidadColores; i++) {
    if (paletaActual[i] && paletaActual[i].bloqueado) {
      nuevaPaleta.push(paletaActual[i]);
      huboColorBloqueado = true; // <-- NUEVO: marcamos que sí hubo un bloqueado
    } else {
      nuevaPaleta.push(generarColorHSL());
    }
  }

  paletaActual = nuevaPaleta;
  renderizarPaleta();

  // <-- NUEVO: mostramos el toast, con un mensaje distinto si había colores bloqueados
  mostrarToast(
    huboColorBloqueado
      ? "Paleta generada (colores bloqueados conservados)"
      : "Paleta generada"
  );
}
// ------------------------------------------------------
// 8. LOCALSTORAGE: leer, guardar, eliminar y mostrar paletas guardadas
// ------------------------------------------------------

// Lee del localStorage el arreglo de paletas guardadas (o un arreglo vacío si no hay nada)
function leerPaletasGuardadas() {
  const datos = localStorage.getItem(CLAVE_LOCALSTORAGE);
  return datos ? JSON.parse(datos) : [];
}

// Guarda la paleta actual (paletaActual) dentro del localStorage
function guardarPaletaActual() {
  if (paletaActual.length === 0) return; // no hay nada que guardar

  const paletasGuardadas = leerPaletasGuardadas();

  // Guardamos solo h, s, l de cada color (el bloqueado no aplica una vez guardado)
  const colores = paletaActual.map(({ h, s, l }) => ({ h, s, l }));
  paletasGuardadas.push(colores);

  // JSON.stringify convierte el arreglo de JS a texto, que es lo único que localStorage acepta
  localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(paletasGuardadas));

  mostrarPaletasGuardadas();
  mostrarToast("Paleta guardada ✔");
}

// Elimina una paleta guardada según su posición en el arreglo
function eliminarPaletaGuardada(index) {
  const paletasGuardadas = leerPaletasGuardadas();
  paletasGuardadas.splice(index, 1); // quita 1 elemento en la posición "index"
  localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(paletasGuardadas));
  mostrarPaletasGuardadas();
  mostrarToast("Paleta eliminada");
}

// Carga una paleta guardada como la paleta actual (para poder verla/editarla de nuevo)
function cargarPaletaGuardada(colores) {
  // Le agregamos "bloqueado: false" a cada color porque el guardado no lo incluye
  paletaActual = colores.map(color => ({ ...color, bloqueado: false }));

  // Actualizamos el select de tamaño para que coincida con la paleta cargada
  selectTamano.value = paletaActual.length;

  renderizarPaleta();
  mostrarToast("Paleta cargada");
}

// Dibuja en pantalla la lista de paletas guardadas, cada una como una fila de miniaturas
function mostrarPaletasGuardadas() {
  contenedorGuardadas.innerHTML = "";

  const paletasGuardadas = leerPaletasGuardadas();

  if (paletasGuardadas.length === 0) {
    contenedorGuardadas.innerHTML = "<p class='sin-guardadas'>Todavía no has guardado ninguna paleta.</p>";
    return;
  }

  paletasGuardadas.forEach((colores, index) => {
    // Fila que representa una paleta guardada completa
    const fila = document.createElement("div");
    fila.classList.add("paleta-guardada");

    // Contenedor de las miniaturas de color
    const miniColores = document.createElement("div");
    miniColores.classList.add("mini-colores");

    colores.forEach(({ h, s, l }) => {
      const mini = document.createElement("div");
      mini.classList.add("mini-color");
      mini.style.backgroundColor = hslToHex(h, s, l);
      miniColores.appendChild(mini);
    });

    // Al hacer clic en las miniaturas, cargamos esa paleta como la actual
    miniColores.addEventListener("click", () => {
      cargarPaletaGuardada(colores);
    });

    // Botón para eliminar esta paleta guardada
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => {
      eliminarPaletaGuardada(index);
    });

    fila.appendChild(miniColores);
    fila.appendChild(btnEliminar);
    contenedorGuardadas.appendChild(fila);
  });
}

// ------------------------------------------------------
// 9. Escuchamos los eventos de los botones y selects
// ------------------------------------------------------
btnGenerar.addEventListener("click", generarPaleta);
btnGuardar.addEventListener("click", guardarPaletaActual);

// Si el usuario cambia el formato (HEX/HSL), solo volvemos a dibujar
// la paleta actual (sin generar colores nuevos)
selectFormato.addEventListener("change", renderizarPaleta);

// 10. Al cargar la página: generamos una paleta inicial y mostramos lo guardado
generarPaleta();
mostrarPaletasGuardadas();