import { countSeats, findAdjacentSeats, isValidPosition } from "./cinema";
import type { Position, Room } from "./cinema";

/** La web comparte el recuento y la búsqueda del ejercicio de consola. */
export function countBookableSeats(room: Room): number {
  return countSeats(room)[1];
}

/** Devuelve el primer par horizontal usando la misma búsqueda que la consola. */
export function findStandardPair(room: Room): [Position, Position] | null {
  return findAdjacentSeats(room);
}

/** Valida toda la selección antes de reservar para evitar confirmaciones parciales. */
export function validateSelection(room: Room, selected: Position[]): string | null {
  for (const [row, column] of selected) {
    if (!isValidPosition(room, row, column)) return "Hay una plaza fuera de la sala.";
    if (room[row][column] === 1) return `Fila ${row} · Asiento ${column}: ocupado.`;
  }
  return null;
}
