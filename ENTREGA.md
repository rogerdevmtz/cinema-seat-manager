# Verificación de entrega

Revisión del 7 de noviembre de 2026 frente al [enunciado oficial en español](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/seats-management-typescript/README.es.md).

| Requisito | Evidencia | Resultado |
| --- | --- | --- |
| Plantilla oficial TypeScript y repositorio propio | Historial de typescript-hello; remoto rogerdevmtz/cinema-seat-manager | Cumple |
| Matriz de 8 × 10, solo 0/1 | createRoom y tipos Seat/Room en src/cinema.ts | Cumple |
| Mostrar X/L e índices de fila y columna | printRoom; npm run console | Cumple |
| Reservar por coordenadas y evitar duplicados | reserveSeat, mensajes y validación de límites | Cumple |
| Contar ocupados y libres | countSeats devuelve una tupla | Cumple |
| Primer par libre horizontal; indicar ausencia | findAdjacentSeats devuelve coordenadas o null; la consola explica el resultado | Cumple |
| Cuatro escenarios | createScenario y demostración en src/main.ts | Cumple |
| Funciones, parámetros, retornos, condicionales, bucles y comentarios | src/cinema.ts y src/main.ts | Cumple |
| Sin objetos/clases para representar los asientos | Matriz numérica; coordenadas, sesiones y entrada en arreglos/tuplas | Cumple |
| Reto extra: HTML, Tailwind e integración con TypeScript | index.html, src/style.css, Vite/Tailwind, src/web.ts | Cumple |
| Reto extra: reservar mediante clics | Seleccionar butacas y confirmar actualiza la matriz compartida | Cumple |
| Código final en GitHub público | https://github.com/rogerdevmtz/cinema-seat-manager, rama main | Cumple |

## Comprobaciones realizadas

- Clonación del repositorio público en una carpeta limpia, npm ci, npm test y npm run build: correctos.
- npm run console: escenarios vacía (80 libres), parcial (48), casi llena con aislados (3) y llena (0); mensajes de reservas y búsqueda correctos.
- Navegador: 80 butacas uniformes, tres estados visuales, pareja inicial correcta, confirmación y recuento, escenarios, cambios de película/fecha/hora y deshacer, sin errores JavaScript.
- Sinopsis, apertura/cierre del tráiler y retirada del reproductor al cerrar; entrada y descarga cubiertas por pruebas. La reproducción del vídeo depende de YouTube.
- Vistas de escritorio entre 1280 × 720 y 1920 × 1080 y móvil de 360/390 px: contenido accesible sin desbordamiento horizontal; escritorio en una sola vista.
- Herramientas de desarrollo: persisten los dos avisos de Vite/esbuild ya documentados en README. npm audit --omit=dev no comunica vulnerabilidades. No impiden ejecutar ni entregar el ejercicio.

La selección pendiente es un estado de la interfaz; no añade un tercer valor a la matriz, que sigue usando exclusivamente 0 y 1. No hay VIP, plazas bloqueadas ni categorías especiales.

## Único paso externo pendiente

Enviar al instructor o pegar en la plataforma el enlace del repositorio público según sus indicaciones. Esta revisión no envía la entrega ni marca tareas en la plataforma. El enunciado no exige un despliegue público de la web.
