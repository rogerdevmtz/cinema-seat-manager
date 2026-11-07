export type Seat = 0 | 1;
export type Room = Seat[][];
export type Position = [row: number, column: number];

/** Crea ocho filas independientes de diez asientos libres. */
export function createRoom(): Room {
  const room: Room = [];
  for (let row = 0; row < 8; row++) {
    const seats: Seat[] = [];
    for (let column = 0; column < 10; column++) seats.push(0);
    room.push(seats);
  }
  return room;
}

/** Valida coordenadas enteras dentro de la matriz. */
export function isValidPosition(
  room: Room,
  row: number,
  column: number,
): boolean {
  return (
    Number.isInteger(row) &&
    Number.isInteger(column) &&
    row >= 0 &&
    row < room.length &&
    column >= 0 &&
    column < room[row].length
  );
}

/** Reserva un asiento disponible y devuelve un mensaje del resultado. */
export function reserveSeat(room: Room, row: number, column: number): string {
  if (!isValidPosition(room, row, column))
    return "Reserva fallida: fila o asiento fuera de rango. Usa filas 0–7 y asientos 0–9.";
  if (room[row][column] === 1)
    return `Reserva fallida: el asiento ${row}, ${column} ya está ocupado.`;
  room[row][column] = 1;
  return `Reserva confirmada: fila ${row}, asiento ${column}.`;
}

/** Devuelve [ocupados, disponibles] contando toda la sala. */
export function countSeats(room: Room): [occupied: number, available: number] {
  let occupied = 0;
  let available = 0;
  for (let row = 0; row < room.length; row++) {
    for (let column = 0; column < room[row].length; column++) {
      if (room[row][column] === 1) occupied++;
      else available++;
    }
  }
  return [occupied, available];
}

/** Busca el primer par horizontal por fila y columna, sin reservarlo. */
export function findAdjacentSeats(room: Room): [Position, Position] | null {
  for (let row = 0; row < room.length; row++) {
    for (let column = 0; column < room[row].length - 1; column++) {
      if (room[row][column] === 0 && room[row][column + 1] === 0)
        return [
          [row, column],
          [row, column + 1],
        ];
    }
  }
  return null;
}

/** Imprime L/X y los índices de filas y columnas. */
export function printRoom(room: Room): void {
  console.log("    0 1 2 3 4 5 6 7 8 9");
  for (let row = 0; row < room.length; row++) {
    let line = `${row} | `;
    for (let column = 0; column < room[row].length; column++)
      line += (room[row][column] === 0 ? "L" : "X") + " ";
    console.log(line.trimEnd());
  }
}

/** Genera escenarios reproducibles: vacía, parcial, aislados y llena. */
export function createScenario(scenario: number): Room {
  const room = createRoom();
  for (let row = 0; row < 8; row++) {
    for (let column = 0; column < 10; column++) {
      if (scenario === 1 && (row * 3 + column * 7) % 5 < 2)
        room[row][column] = 1;
      if (scenario === 2 || scenario === 3) room[row][column] = 1;
    }
  }
  if (scenario === 2) {
    room[0][0] = 0;
    room[3][5] = 0;
    room[7][9] = 0;
  }
  return room;
}
