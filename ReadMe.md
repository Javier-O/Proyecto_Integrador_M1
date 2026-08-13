# Generador de Paletas de Color

Proyecto Integrador del Módulo 1 del curso Fullstack de Henry. Aplicación web que genera paletas de color aleatorias, con opción de bloquear colores, guardarlos y copiarlos al portapapeles.

## Descripción

Esta aplicación permite generar paletas de colores aleatorias pensadas para apoyar procesos de diseño (branding, UI, ilustración, etc.). Cada color se genera internamente en formato HSL y se convierte a HEX para poder visualizarlo y copiarlo fácilmente.

## Funcionalidades

- Selección de tamaño de paleta: 6, 8 o 9 colores.
- Generación aleatoria de colores en formato HSL, convertidos y mostrados en HEX.
- Cambio de formato de visualización: ver el código de cada color en HEX o en HSL.
- Bloqueo de colores 🔒: permite fijar un color para que no cambie al generar una nueva paleta, mientras el resto sí se regenera.
- Copiar al portapapeles: clic sobre cualquier color para copiar su código HEX.
- Guardado de paletas: las paletas se guardan en localStorage del navegador, por lo que persisten aunque cierres la pestaña.
- Cargar y eliminar paletas guardadas: desde la sección "Paletas Guardadas" se puede volver a cargar una paleta anterior o eliminarla.

## Tecnologías utilizadas

- HTML5 
- CSS3
- JavaScript
- localStorage

## Estructura del proyecto

```
├── index.html      # Estructura semántica de la página
├── style.css       # Estilos visuales de la aplicación
├── script.js       # Lógica: generación, bloqueo, copiado y localStorage
└── README.md       # Este archivo
```

## Cómo usarlo localmente

1. Clona este repositorio:
   ```
   git clone https://github.com/tu-usuario/nombre-del-repo.git
   ```
2. Abre la carpeta del proyecto en Visual Studio Code.
3. Abre `index.html` con la extensión Live Server (clic derecho → "Open with Live Server").

## Cómo usar la aplicación

1. Elige el tamaño de la paleta (6, 8 o 9 colores).
2. Elige el formato del código que quieres visualizar (HEX o HSL).
3. Presiona "Generar Paleta" para crear una nueva paleta aleatoria.
4. Haz clic en el candado 🔓 de un color para bloquearlo antes de generar una nueva paleta.
5. Haz clic sobre cualquier color para copiar su código HEX al portapapeles.
6. Presiona "Guardar Paleta" para guardarla; aparecerá en la sección "Paletas Guardadas", donde puedes volver a cargarla o eliminarla.

## Autor

Alberto Javier Ojeda Gutiérrez — Proyecto Integrador, Módulo 1 del curso de Desarrollo Web.
Se utilizó la asistencia de claude durante el desarrollo de este código. 