import { findAdjacentSeats, isValidPosition } from "./cinema";
import type { Position, Room } from "./cinema";

export type SeatKind = "standard" | "vip" | "wheelchair" | "companion" | "blocked";
// Tres bloques de butacas, separados por pasillos después de las columnas 2 y 7.
const seatBlocks: [number, number][] = [[0, 3], [3, 8], [8, 10]];
// Metadatos del plano en arreglos de coordenadas; la ocupación sigue siendo 0/1.
const wheelchairPlaces: Position[] = [
  [0, 1],
  [0, 6],
];
const companionPlaces: Position[] = [
  [0, 2],
  [0, 7],
];
const blockedPlaces: Position[] = [
  [4, 4],
  [4, 5],
];

/** Identifica el tipo de plaza sin modificar la matriz de reservas. */
export function getSeatKind(row: number, column: number): SeatKind {
  if (wheelchairPlaces.some((p) => p[0] === row && p[1] === column))
    return "wheelchair";
  if (companionPlaces.some((p) => p[0] === row && p[1] === column))
    return "companion";
  if (blockedPlaces.some((p) => p[0] === row && p[1] === column))
    return "blocked";
  if (row >= 5 && row <= 7 && column >= 3 && column <= 7) return "vip";
  return "standard";
}

/** Obtiene la plaza accesible vinculada a un acompañante. */
export function wheelchairFor(row: number, column: number): Position | null {
  const index = companionPlaces.findIndex(
    (p) => p[0] === row && p[1] === column,
  );
  return index < 0 ? null : [...wheelchairPlaces[index]];
}

/** Cuenta solo plazas libres que se pueden reservar, excluyendo los bloqueos. */
export function countBookableSeats(room: Room): number {
  let available = 0;
  for (let row = 0; row < room.length; row++) {
    for (let column = 0; column < room[row].length; column++) {
      if (room[row][column] === 0 && getSeatKind(row, column) !== "blocked")
        available++;
    }
  }
  return available;
}

/** Busca dos butacas estándar o VIP juntas, sin atravesar pasillos ni asignar plazas accesibles. */
export function findStandardPair(room: Room): [Position, Position] | null {
  const candidates: Room = room.map((seats, row) =>
    seats.map((seat, column) =>
      ["standard", "vip"].includes(getSeatKind(row, column)) ? seat : 1,
    ),
  );
  for (let row = 0; row < candidates.length; row++) {
    for (const [start, end] of seatBlocks) {
      const pair = findAdjacentSeats([candidates[row].slice(start, end)]);
      if (pair) return [[row, start + pair[0][1]], [row, start + pair[1][1]]];
    }
  }
  return null;
}

/** Devuelve la primera plaza de silla de ruedas con su acompañante libre. */
export function findAccessiblePair(room: Room): [Position, Position] | null {
  for (let index = 0; index < wheelchairPlaces.length; index++) {
    const [row, column] = wheelchairPlaces[index];
    const [companionRow, companionColumn] = companionPlaces[index];
    if (
      isValidPosition(room, row, column) &&
      isValidPosition(room, companionRow, companionColumn) &&
      room[row][column] === 0 &&
      room[companionRow][companionColumn] === 0
    )
      return [
        [row, column],
        [companionRow, companionColumn],
      ];
  }
  return null;
}

/** Valida toda la selección antes de confirmar para evitar reservas parciales. */
export function validateSelection(
  room: Room,
  selected: Position[],
): string | null {
  for (const [row, column] of selected) {
    if (!isValidPosition(room, row, column))
      return "Hay una plaza fuera de la sala.";
    if (getSeatKind(row, column) === "blocked")
      return `Fila ${row} · Asiento ${column}: bloqueado.`;
    if (room[row][column] === 1)
      return `Fila ${row} · Asiento ${column}: ocupado.`;
    const wheelchair = wheelchairFor(row, column);
    if (
      wheelchair &&
      !selected.some((p) => p[0] === wheelchair[0] && p[1] === wheelchair[1])
    )
      return "El acompañante se reserva junto a su plaza para silla de ruedas.";
  }
  return null;
}
