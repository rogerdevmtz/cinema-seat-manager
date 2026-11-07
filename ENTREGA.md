# Verificación de entrega

Revisión del **7 de noviembre de 2026**, contrastada con el [enunciado oficial de 4Geeks Academy](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/seats-management-typescript/README.es.md).

## Requisitos del reto

| Requisito | Evidencia | Estado |
| --- | --- | --- |
| Partir de la plantilla oficial y utilizar un repositorio propio | Historial de `typescript-hello` y remoto `rogerdevmtz/cinema-seat-manager` | Cumple |
| Matriz 8 × 10 con disponibles `0` y ocupados `1` | `createRoom`, tipos `Seat` y `Room` en [cinema.ts](src/cinema.ts) | Cumple |
| Imprimir `L`/`X` con números de fila y columna | `printRoom` | Cumple |
| Reservar por coordenadas, comprobar disponibilidad y devolver éxito/error | `reserveSeat`; además valida coordenadas fuera de rango | Cumple |
| Contar ocupados y disponibles | `countSeats` | Cumple |
| Encontrar el primer par horizontal o indicar que no existe | `findAdjacentSeats` devuelve coordenadas o `null`; la consola muestra el mensaje | Cumple |
| Demostrar los cuatro escenarios con mensajes claros | [main.ts](src/main.ts), `createScenario` y pruebas | Cumple |
| Comentar las funciones y representar asientos sin objetos ni clases | Funciones documentadas; matriz numérica y coordenadas en tuplas | Cumple |
| Reto extra: HTML y Tailwind integrados con TypeScript, reserva mediante clics | [index.html](index.html), [web.ts](src/web.ts), estilos y configuración Tailwind | Cumple |

Las APIs del navegador y la configuración de Vite son parte del entorno; no se usan para representar los datos de los asientos. La selección pendiente se mantiene aparte de la matriz. Los pasillos únicamente añaden espacio visual y no alteran las 80 plazas ni la búsqueda del primer par por coordenadas.

## Criterios de evaluación

| Criterio del enunciado | Dónde comprobarlo |
| --- | --- |
| Arreglo bidimensional correcto | `createRoom` y `Room = Seat[][]`; prueba de dimensiones y filas independientes. |
| Funciones con parámetros y retornos | `reserveSeat`, `countSeats`, `findAdjacentSeats`; tipos explícitos. |
| Condicionales para validar disponibilidad | `isValidPosition` y comprobación de ocupación en `reserveSeat`. |
| Bucles para procesar y mostrar la matriz | Bucles `for` de inicialización, impresión, recuento y búsqueda. |
| Búsqueda horizontal de contiguos libres | Pruebas del primer par, último par, asientos aislados y separación de filas. |
| Código legible y nombres significativos | Lógica central separada de la interfaz; comentarios en las funciones. |
| Ejecución sin errores y resultados esperados | `npm test`, `npm run typecheck`, `npm run build` y `npm run console`. |
| Salida clara y útil por consola | Matriz con índices, totales y mensajes de reserva confirmada, duplicada, inválida y ausencia de parejas. |

La interfaz web es el reto extra opcional y no forma parte de los criterios de evaluación oficiales.

## Resultados comprobados

| Escenario inicial | Ocupados | Libres | Primer par |
| --- | ---: | ---: | --- |
| Vacía | 0 | 80 | Fila 0, columnas 0 y 1 |
| Parcial | 32 | 48 | Fila 0, columnas 1 y 2 |
| Casi llena, con asientos aislados | 77 | 3 | No existe |
| Llena | 80 | 0 | No existe |

Estos son los valores **antes** de las reservas de demostración que ejecuta la consola.

- **Instalación:** verificada desde una copia limpia del repositorio, con el archivo de bloqueo de dependencias.
- **Pruebas:** 23 comprobaciones de lógica central, comprobaciones de selección y escenarios, y pruebas de contenido, escape XML y ajuste de la entrada SVG.
- **Web:** selección y retirada de plazas, reserva y recuento, búsqueda de parejas, cambios de sesión y deshacer, escenarios, sinopsis, apertura/cierre del tráiler y descarga de entrada.
- **Responsive y teclado:** revisión en escritorio de 1024–1920 px, tableta de 768/820 px y móvil de 320–414 px; 80 botones, pasillos visuales, foco, flechas, avisos y acceso móvil a la confirmación. Sin desbordamiento horizontal; las 80 plazas y la reserva caben en escritorio desde 1280 × 720.
- **Capturas:** [escritorio](docs/screenshots/desktop.png), [sesión móvil](docs/screenshots/mobile-session.png), [mapa móvil](docs/screenshots/mobile-seats.png) y [reserva móvil](docs/screenshots/mobile-reservation.png), tomadas de la aplicación actual.

Las notas sobre las herramientas de desarrollo y los vídeos externos están en [créditos y dependencias](docs/CREDITOS.md).

## Cómo entregar

1. El código final está subido a la rama `main` de un **repositorio público**.
2. Envía este enlace al instructor o pégalo en la plataforma según sus indicaciones:

   **https://github.com/rogerdevmtz/cinema-seat-manager**

No se requiere un despliegue público de la web. La presentación en la plataforma es el único paso externo pendiente; esta revisión no la envía ni marca las tareas del curso.
