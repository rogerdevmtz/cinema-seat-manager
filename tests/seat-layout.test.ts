import { createRoom, createScenario, findAdjacentSeats } from "../src/cinema";
import { countBookableSeats, findStandardPair, validateSelection } from "../src/seat-layout";
import { strict as assert } from "node:assert";
for (let scenario = 0; scenario < 4; scenario++) {
  const room = createScenario(scenario);
  assert.equal(countBookableSeats(room), [80, 48, 3, 0][scenario]);
  assert.deepEqual(findStandardPair(room), findAdjacentSeats(room));
}
const room = createRoom();
assert.equal(validateSelection(room, [[0, 1], [0, 2], [4, 4], [5, 3]]), null);
room[0][2] = 1;
assert.match(validateSelection(room, [[0, 1], [0, 2]]) || "", /ocupado/);
assert.equal(room[0][1], 0, "Validar no confirma parcialmente la reserva");
assert.match(validateSelection(room, [[8, 0]]) || "", /fuera/);
console.log("✓ Recuentos de los cuatro escenarios, búsqueda compartida y validación previa sin restricciones por tipo.");
