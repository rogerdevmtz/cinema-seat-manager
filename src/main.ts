import { countSeats, createScenario, findAdjacentSeats, printRoom, reserveSeat } from "./cinema";

/** Ejecuta los cuatro escenarios y demuestra reservas correctas e inválidas. */
function runConsoleDemo(): void {
  const titles = ["SALA VACÍA", "SALA PARCIALMENTE OCUPADA", "SALA CASI LLENA: ASIENTOS AISLADOS", "SALA COMPLETAMENTE LLENA"];
  for (let scenario = 0; scenario < titles.length; scenario++) {
    const room = createScenario(scenario);
    console.log(`\n=== ${titles[scenario]} ===`);
    printRoom(room);
    const [occupied, available] = countSeats(room);
    console.log(`Ocupados: ${occupied} | Disponibles: ${available} | Total: ${occupied + available}`);
    const pair = findAdjacentSeats(room);
    if (pair) console.log(`Asientos contiguos encontrados: fila ${pair[0][0]}, asientos ${pair[0][1]} y ${pair[1][1]}.`);
    else console.log("No hay dos asientos libres contiguos en la misma fila.");
    console.log(reserveSeat(room, 0, 0));
    console.log(reserveSeat(room, 0, 0));
    console.log(reserveSeat(room, 8, 10));
    console.log("Estado después de las operaciones:");
    printRoom(room);
    const counts = countSeats(room);
    console.log(`Ocupados: ${counts[0]} | Disponibles: ${counts[1]}`);
  }
}

if (typeof document === "undefined") runConsoleDemo();
else import("./web");
