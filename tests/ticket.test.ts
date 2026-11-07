import { createTicketSvg } from "../src/ticket";
const svg = createTicketSvg([
  "RM-TEST1234",
  'Una película <especial> & "única"',
  "7 nov · 18:00 · Sala 01",
  "Fila 0 · Silla de ruedas 1 / Fila 0 · Acompañante 2",
]);
if (
  !svg.includes("RM-TEST1234") ||
  !svg.includes("Silla de ruedas 1") ||
  !svg.includes("Acompañante 2")
)
  throw new Error("La entrada debe conservar sus datos confirmados");
if (
  svg.includes("<especial>") ||
  !svg.includes("&lt;especial&gt;") ||
  !svg.includes("&amp;")
)
  throw new Error("El contenido de la entrada debe escaparse");
if (!svg.includes("SIN VALIDEZ PARA ACCESO"))
  throw new Error("La entrada de demostración debe identificarse");
const manySeats = Array.from(
  { length: 80 },
  (_, i) => `Fila ${Math.floor(i / 10)} · Asiento ${i % 10}`,
).join(" / ");
const longTicket = createTicketSvg([
  "RM-LARGE",
  "Una película con un título muy largo para comprobar su ajuste en la entrada",
  "7 nov · 18:00 · Sala 01",
  manySeats,
]);
const height = Number(longTicket.match(/height="(\d+)"/)?.[1]);
const textPositions = [...longTicket.matchAll(/<text[^>]*y="(\d+)"/g)].map(
  (match) => Number(match[1]),
);
if (!height || height <= 540 || textPositions.some((y) => y >= height))
  throw new Error("Una reserva extensa debe caber en su entrada");
console.log(
  "✓ Entrada: datos confirmados, escape XML, identificación demo y ajuste de 80 asientos.",
);
