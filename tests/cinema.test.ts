import {
  countSeats,
  createRoom,
  createScenario,
  findAdjacentSeats,
  reserveSeat,
} from "../src/cinema";
let checks = 0;
function check(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
  checks++;
}
const room = createRoom();
check(
  room.length === 8 && room.every((row) => row.length === 10),
  "Dimensiones 8 × 10",
);
check(JSON.stringify(countSeats(room)) === "[0,80]", "Vacía");
check(
  JSON.stringify(findAdjacentSeats(room)) === "[[0,0],[0,1]]",
  "Primer par",
);
check(
  reserveSeat(room, 0, 0).startsWith("Reserva confirmada"),
  "Reserva válida",
);
check(room[1][0] === 0, "Filas independientes");
check(reserveSeat(room, 0, 0).includes("ya está ocupado"), "Duplicada");
for (const [row, column] of [
  [-1, 0],
  [8, 0],
  [0, -1],
  [0, 10],
  [0.5, 1],
  [NaN, 0],
  [0, Infinity],
]) {
  check(
    reserveSeat(room, row, column).includes("fuera de rango"),
    "Coordenadas inválidas",
  );
}
check(
  JSON.stringify(countSeats(room)) === "[1,79]",
  "Errores no modifican datos",
);
check(
  JSON.stringify(findAdjacentSeats(room)) === "[[0,1],[0,2]]",
  "Siguiente par",
);
check(findAdjacentSeats(createScenario(2)) === null, "Aislados");
check(JSON.stringify(countSeats(createScenario(2))) === "[77,3]", "Casi llena");
const full = createScenario(3);
check(JSON.stringify(countSeats(full)) === "[80,0]", "Llena");
check(findAdjacentSeats(full) === null, "Sin parejas");
full[0][9] = 0;
full[1][0] = 0;
check(findAdjacentSeats(full) === null, "No unir distintas filas");
full[7][8] = 0;
full[7][9] = 0;
const before = JSON.stringify(full);
check(
  JSON.stringify(findAdjacentSeats(full)) === "[[7,8],[7,9]]",
  "Último par",
);
check(JSON.stringify(full) === before, "Buscar no modifica datos");
const partial = countSeats(createScenario(1));
check(
  partial[0] > 0 && partial[1] > 0 && partial[0] + partial[1] === 80,
  "Parcial",
);
console.log(`✓ ${checks} comprobaciones superadas.`);
