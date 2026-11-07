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

Interfaz HTML + Tailwind con la marca de R. Martínez y su azul `#0047FB`. La composición sigue la referencia visual aportada: progreso de reserva en la parte superior y tres paneles alineados. En escritorio, la distribución sigue tres pasos en una sola vista: película y sesión a la izquierda, las 80 plazas en el centro, y revisión de la reserva a la derecha. «Cambiar» abre la cartelera en un diálogo; elegir una película actualiza la ficha y el resumen. Volver a elegir la película actual conserva los asientos pendientes. Se ha verificado que cabe sin desplazamiento vertical en 1366 × 768. En móvil, el contenido se organiza en una sola página y el acceso al resumen permanece a mano al seleccionar.

La ficha muestra el póster vertical completo, con un botón circular de reproducción centrado sobre su borde inferior. La pantalla conserva una línea curva sin brillo y un halo azul suave y difuminado; las acciones auxiliares tienen menor énfasis que la selección y la confirmación. «Sinopsis» y «Tráiler» se abren en diálogos sobre la reserva. Las fichas incluyen duración, año, dirección y reparto. Los tráileres oficiales se cargan solo al pulsar y se detienen al cerrar; también hay un enlace directo a YouTube si el proveedor impide reproducirlos dentro de la web.

El resumen incluye una miniatura sincronizada con la película, el total gratuito de demostración y los datos de fila y asiento destacados. Cada cruz retira una plaza; pulsar sus datos no modifica la selección. Las selecciones largas se desplazan dentro del resumen para mantener visible la confirmación.

1. Elige una película, una fecha y una hora de demostración.
2. Pulsa una butaca libre para seleccionarla. Pulsa de nuevo para retirarla.
3. Puedes usar «Encontrar 2 juntos»: selecciona el primer par disponible y sustituye tu selección anterior.
4. Revisa el resumen y pulsa «Confirmar». Solo entonces se ocupan los asientos.
5. Los avisos junto al mapa explican cada operación. La confirmación abre una entrada con película, sesión, asientos y referencia local. «Guardar entrada» descarga un SVG autónomo con el logo y los datos confirmados. «Mi entrada» recupera la última entrada de la visita, incluso al cambiar de película.

Los tres horarios se muestran como botones, con la sesión activa identificada. Cada sesión de ejemplo mantiene su propia matriz durante la visita; cambiar de película, fecha u hora retira la selección pendiente y conserva las reservas confirmadas. El aviso permite «Deshacer» para recuperar la sesión y sus asientos pendientes hasta la siguiente operación. En móvil, los errores y la acción «Deshacer» aparecen sobre el contenido si el aviso está fuera de la vista, sin duplicarlo ni tapar el botón de reserva. No hay servidor, pagos ni persistencia: al recargar se reinician todos los datos. La cartelera y las fechas son una demostración, no programación real de un cine.

El botón «Demo» abre los escenarios del ejercicio en un diálogo separado de la reserva. Cargar un escenario sustituye los datos de la sesión actual, previa confirmación. Permite comprobar visualmente los cuatro casos de la consola.

Se puede operar con teclado (Tab, flechas, Inicio/Fin, Enter y Espacio). Se pueden retirar asientos individualmente desde el resumen. La selección muestra una marca además del color, hay foco visible y los avisos se anuncian a lectores de pantalla. En móvil se mantiene el orden película y sesión → mapa → resumen. La cartelera se abre con «Cambiar» y el resumen aparece después del mapa. Un acceso fijo permite revisar la reserva y se oculta al consultar el resumen.

## Fichas, tráileres y entradas

Las sinopsis se han redactado en español a partir de fuentes oficiales. Datos y enlaces:

- [Ant-Man and The Wasp: Quantumania — Disney](https://movies.disney.com/ant-man-and-the-wasp-quantumania).
- [Avatar: The Way of Water — Avatar](https://www.avatar.com/movies/avatar-the-way-of-water).
- [The Flash — DC](https://www.dc.com/theflash), [duración — Warner Bros.](https://www.warnerbros.co.jp/home_entertainment/91z6amj2f80/).
- [M3GAN — Universal Pictures Home Entertainment](https://www.universalpicturesathome.com/movies/m3gan).

Los vídeos pertenecen a los canales oficiales de Marvel Entertainment, Avatar, Warner Bros. Pictures y Universal Pictures. Su disponibilidad y reproducción dependen de YouTube y de la región del visitante.

Las reservas y la última entrada se mantienen durante la visita, sin servidor ni pagos. La descarga sí se conserva como archivo. Todas las entradas indican que son de demostración y no permiten acceder a un cine real. No se simulan códigos QR ni validaciones de taquilla.

## Plano ajustado al ejercicio

Las 80 butacas tienen el mismo tipo. La matriz solo guarda 0 (libre) o 1 (ocupado); la selección pendiente se representa aparte hasta confirmar. No hay VIP, bloqueos ni restricciones de acompañantes. La web comparte el recuento y la búsqueda del primer par horizontal con la consola: 80 libres en sala vacía y 48 en el escenario parcial.

## Organización

- `src/cinema.ts`: lógica central compartida, sin dependencias del navegador.
- `src/main.ts`: entrada y demostración de consola.
- `src/seat-layout.ts`: validación de la selección y acceso a la lógica compartida.
- `src/movie-details.ts`: fichas verificadas y tráileres oficiales.
- `src/ticket.ts`: generación de entradas SVG con escape XML y ajuste de texto.
- `public/icons.svg`: iconos vectoriales locales de trazo uniforme.
- `src/web.ts`: interfaz y eventos; utiliza las funciones de la lógica central.
- `src/style.css`: Tailwind y estilos base.
- `src/reference.css`: composición y adaptación responsive de la referencia actual.
- `index.html`: estructura semántica de la web.
- `tests/cinema.test.ts`: 23 comprobaciones de casos normales y límites.
- `tests/seat-layout.test.ts`: recuentos de escenarios, búsqueda compartida y validación previa de la selección.
- `tests/ticket.test.ts`: datos de entrada, escape XML, identificación de demostración y ajuste de 80 asientos.
- `public/posters/`: pósteres ilustrativos de la cartelera.

## Evaluación

La funcionalidad de consola demuestra matriz bidimensional, funciones con retorno, condicionales, bucles, búsqueda horizontal, legibilidad y mensajes claros. La interfaz web es el reto extra y no forma parte de los criterios de evaluación del enunciado.

## Entrega

Ver [lista de verificación frente al enunciado oficial](./ENTREGA.md).

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

Plantilla: ehiber y colaboradores de 4Geeks Academy. Referencia visual: captura aportada por el usuario. Pósteres y fondos cinematográficos obtenidos de TMDB para ilustrar el prototipo educativo; los derechos corresponden a sus respectivos titulares. Logo de R. Martínez aportado por el usuario; azul principal muestreado de la referencia: `#0047FB`. Este prototipo no representa un sistema real de venta.
