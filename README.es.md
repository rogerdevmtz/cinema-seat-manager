# Cinema Seat Manager

Proyecto de 4Geeks Academy basado en la plantilla oficial [typescript-hello](https://github.com/4GeeksAcademy/typescript-hello). Incluye el programa de consola evaluable y el reto extra con HTML, Tailwind CSS y TypeScript.

## Requisitos y ejecución

Instala Node.js 22 o superior y npm. Desde esta carpeta:

```sh
npm install
npm run console
npm run start
```

`console` muestra los cuatro escenarios en la terminal. `start` abre el servidor de desarrollo; visita la dirección que muestre la terminal, normalmente http://localhost:5173.

```sh
npm test
npm run typecheck
npm run build
npm run preview
```

Las pruebas comprueban la lógica; `typecheck` valida TypeScript; `build` genera la web en `dist`; `preview` sirve esa versión.

## Requisitos implementados

- Matriz de 8 filas × 10 asientos, con 0 = libre y 1 = ocupado.
- Inicialización mediante una función, con filas independientes.
- Consola con L/X e índices de filas 0–7 y columnas 0–9.
- Reserva por coordenadas, validación de disponibilidad y mensajes de éxito/error.
- Validación adicional de coordenadas negativas, decimales, no finitas o fuera de rango.
- Recuento que devuelve [ocupados, disponibles].
- Búsqueda del primer par libre horizontal: de arriba abajo y de izquierda a derecha. Devuelve dos coordenadas o null. Buscar no modifica la sala.
- Cuatro escenarios reproducibles: vacía (80 libres), parcial (48 libres), casi llena (3 libres aislados) y llena (0 libres).
- Funciones comentadas, parámetros y retornos tipados, bucles y condicionales.

Los datos del cine se representan con arreglos, matrices, tuplas y valores simples. No se usan clases ni objetos para modelar asientos o reservas. Los objetos del navegador (DOM/eventos) y la configuración original de las herramientas son APIs del entorno, no el modelo de datos del ejercicio.

## Reto extra

Interfaz HTML + Tailwind con el estilo de la referencia proporcionada: azul oscuro, acentos azules del logo de R. Martínez, cartelera, resumen lateral y pantalla curva. Conserva las dimensiones 8 × 10 y los índices desde cero exigidos por el proyecto.

1. Elige una película, una fecha y una hora de demostración.
2. Pulsa una butaca libre para seleccionarla. Pulsa de nuevo para retirarla.
3. Puedes usar «Encontrar 2 juntos»: selecciona el primer par disponible y sustituye tu selección anterior.
4. Revisa el resumen y pulsa «Confirmar». Solo entonces se ocupan los asientos.
5. Los avisos junto al mapa explican cada operación. La confirmación abre un comprobante con película, sesión y asientos, que se cierra con el botón o Escape.

Cada sesión de ejemplo mantiene su propia matriz durante la visita; cambiar de sesión borra la selección pendiente y conserva las reservas confirmadas. No hay servidor, pagos ni persistencia: al recargar se reinician todos los datos. La cartelera y las fechas son una demostración, no programación real de un cine.

La sección «Probar los escenarios del ejercicio» sustituye los datos de la sesión actual, previa confirmación. Permite comprobar visualmente los cuatro casos de la consola.

Se puede operar con teclado (Tab, flechas, Inicio/Fin, Enter y Espacio). Se pueden retirar asientos individualmente desde el resumen. La selección muestra una marca además del color, hay foco visible y los avisos se anuncian a lectores de pantalla. En móvil la cartelera se desplaza horizontalmente y el resumen aparece después del mapa. Un acceso fijo permite revisar la reserva y se oculta al consultar el resumen.

## Organización

- `src/cinema.ts`: lógica central compartida, sin dependencias del navegador.
- `src/main.ts`: entrada y demostración de consola.
- `src/web.ts`: interfaz y eventos; utiliza las funciones de la lógica central.
- `src/style.css`: Tailwind y estilos de la referencia.
- `index.html`: estructura semántica de la web.
- `tests/cinema.test.ts`: 23 comprobaciones de casos normales y límites.
- `public/posters/`: pósteres ilustrativos de la cartelera.

## Evaluación

La funcionalidad de consola demuestra matriz bidimensional, funciones con retorno, condicionales, bucles, búsqueda horizontal, legibilidad y mensajes claros. La interfaz web es el reto extra y no forma parte de los criterios de evaluación del enunciado.

## Entrega

Repositorio público de entrega: [rogerdevmtz/cinema-seat-manager](https://github.com/rogerdevmtz/cinema-seat-manager).

Entrega ese enlace al instructor siguiendo sus indicaciones. El código está subido a la rama `main`, con el historial de la plantilla y los commits del proyecto.

Para obtener una copia:

```sh
git clone https://github.com/rogerdevmtz/cinema-seat-manager.git
cd cinema-seat-manager
npm install
npm run console
npm run start
```

No es necesario publicar la web para cumplir la entrega. Las reservas de la interfaz son temporales y se reinician al recargar.

## Dependencias de la plantilla

Se conserva Vite 5 de la plantilla oficial. Se aplicaron las correcciones compatibles disponibles; `npm audit` mantiene dos avisos de herramientas de desarrollo (Vite/esbuild) que requieren cambiar de versión principal. No se ha realizado esa migración para mantener el stack solicitado. El servidor de desarrollo debe utilizarse en local.

## Créditos

Plantilla: ehiber y colaboradores de 4Geeks Academy. Referencia visual: captura aportada por el usuario. Pósteres obtenidos de TMDB para ilustrar el prototipo educativo; los derechos corresponden a sus respectivos titulares. Logo de R. Martínez aportado por el usuario; azul principal muestreado de la referencia: `#0047FB`. Este prototipo no representa un sistema real de venta.
