import { createRoom, createScenario } from "../src/cinema";
import {
  countBookableSeats,
  findAccessiblePair,
  findStandardPair,
  getSeatKind,
  validateSelection,
  wheelchairFor,
} from "../src/seat-layout";
let checks = 0;
function check(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
  checks++;
}
const empty = createRoom();
check(countBookableSeats(empty) === 78, "Dos bloqueos excluidos del recuento");
check(getSeatKind(0, 1) === "wheelchair", "Plaza de silla de ruedas");
check(getSeatKind(0, 2) === "companion", "Plaza de acompañante");
check(getSeatKind(4, 4) === "blocked", "Bloqueo");
check(getSeatKind(1, 1) === "standard", "Normal");
check(
  JSON.stringify(wheelchairFor(0, 7)) === "[0,6]",
  "Vínculo de acompañante",
);
check(wheelchairFor(1, 1) === null, "Asiento normal sin vínculo");
check(
  JSON.stringify(findAccessiblePair(empty)) === "[[0,1],[0,2]]",
  "Primera pareja accesible",
);
check(
  JSON.stringify(findStandardPair(empty)) === "[[0,3],[0,4]]",
  "La búsqueda normal evita plazas especiales",
);
check(
  validateSelection(empty, [[0, 1]]) === null,
  "Silla de ruedas sin acompañante permitida",
);
check(
  validateSelection(empty, [
    [0, 1],
    [0, 2],
  ]) === null,
  "Reserva accesible y acompañante",
);
check(
  validateSelection(empty, [[0, 2]]) !== null,
  "Acompañante no puede reservarse solo",
);
check(
  validateSelection(empty, [[4, 4]])?.includes("bloqueado") === true,
  "Bloqueo rechazado antes de reservar",
);
check(
  validateSelection(empty, [[8, 0]]) !== null,
  "Posición inválida rechazada",
);
const original = JSON.stringify(empty);
findStandardPair(empty);
findAccessiblePair(empty);
validateSelection(empty, [[4, 4]]);
check(
  JSON.stringify(empty) === original,
  "Consulta y validación no modifican la ocupación",
);
empty[0][1] = 1;
check(
  JSON.stringify(findAccessiblePair(empty)) === "[[0,6],[0,7]]",
  "Siguiente pareja accesible",
);
check(
  validateSelection(empty, [
    [0, 1],
    [0, 2],
  ])?.includes("ocupado") === true,
  "Ocupación accesible respetada",
);
empty[0][7] = 1;
check(findAccessiblePair(empty) === null, "No hay parejas accesibles libres");
const full = createScenario(3);
check(countBookableSeats(full) === 0, "Sala llena sin disponibles");
check(
  findStandardPair(full) === null && findAccessiblePair(full) === null,
  "Sala llena sin parejas",
);
check(
  countBookableSeats(createScenario(1)) === 47,
  "Escenario parcial con un bloqueo adicional libre",
);
const onlyAccessible = createScenario(3);
onlyAccessible[0][1] = 0;
onlyAccessible[0][2] = 0;
check(
  findStandardPair(onlyAccessible) === null,
  "No asignar plazas accesibles a búsqueda normal",
);
check(
  findAccessiblePair(onlyAccessible) !== null,
  "Plazas accesibles siguen reservables",
);
console.log(
  `✓ ${checks} comprobaciones de plazas accesibles y bloqueos superadas.`,
);
