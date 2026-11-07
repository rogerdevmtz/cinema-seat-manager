# Créditos y fuentes

- Desarrollo: [rogerdevmtz](https://github.com/rogerdevmtz).
- Plantilla: [4GeeksAcademy/typescript-hello](https://github.com/4GeeksAcademy/typescript-hello), por ehiber y colaboradores de 4Geeks Academy.
- Enunciado: [Cinema Seat Manager](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/seats-management-typescript/README.es.md).
- Diseño: referencia visual y logo de R. Martínez aportados por el autor; azul de marca `#0047FB`.
- Carteles: TMDB, utilizados para ilustrar este prototipo educativo. Los derechos de las películas e imágenes corresponden a sus titulares.

## Información de las películas

Las sinopsis se redactaron en español a partir de las fuentes oficiales. Los metadatos y enlaces de los tráileres están en [src/movie-details.ts](../src/movie-details.ts).

- [Ant-Man and The Wasp: Quantumania — Disney](https://movies.disney.com/ant-man-and-the-wasp-quantumania).
- [Avatar: The Way of Water — Avatar](https://www.avatar.com/movies/avatar-the-way-of-water).
- [The Flash — DC](https://www.dc.com/theflash); [duración — Warner Bros.](https://www.warnerbros.co.jp/home_entertainment/91z6amj2f80/).
- [M3GAN — Universal Pictures Home Entertainment](https://www.universalpicturesathome.com/movies/m3gan).

Los tráileres pertenecen a los canales oficiales de Marvel Entertainment, Avatar, Warner Bros. Pictures y Universal Pictures. YouTube determina su disponibilidad y reproducción; el diálogo ofrece un enlace externo como alternativa.

## Dependencias de desarrollo

Se conserva Vite 5 de la plantilla. La instalación comunica dos avisos de seguridad de Vite/esbuild, documentados durante la revisión; su corrección requiere una actualización mayor del entorno. `npm audit --omit=dev` no comunica vulnerabilidades. Esta entrega mantiene el stack de la plantilla y el servidor de desarrollo para uso local.
