import "./style.css";
import {
  countSeats,
  createScenario,
  findAdjacentSeats,
  reserveSeat,
} from "./cinema";
import type { Position, Room } from "./cinema";

// Los datos propios se mantienen en arreglos. No se modelan reservas con objetos o clases.
const movieTitles = [
  "Ant-Man and The Wasp: Quantumania",
  "Avatar: The Way of Water",
  "The Flash",
  "M3GAN",
];
const movieGenres = [
  "Acción · Aventura",
  "Ciencia ficción · Aventura",
  "Acción · Ciencia ficción",
  "Terror · Ciencia ficción",
];
const movieTags = [
  "MARVEL STUDIOS",
  "UN VIAJE A PANDORA",
  "CAMBIA TU DESTINO",
  "TU NUEVA MEJOR AMIGA",
];
const dayNames = ["Sáb", "Dom", "Lun", "Mar", "Mié", "Jue", "Vie"];
const sessions: Room[] = [];
for (let session = 0; session < 84; session++) sessions.push(createScenario(1));
let movie = 0;
let day = 0;
let time = 1;
let selected: Position[] = [];

/** Obtiene un elemento existente y mantiene su tipo de control. */
function element<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error(`No se encuentra el elemento ${id}`);
  return found as T;
}

/** Devuelve el índice y la matriz de la sesión de demostración actual. */
function sessionIndex(): number {
  return movie * 21 + day * 3 + time;
}
function currentRoom(): Room {
  return sessions[sessionIndex()];
}

/** Actualiza el aviso persistente y accesible después de una operación. */
function feedback(message: string, state = "info"): void {
  element("feedback").className = `feedback floating ${state}`;
  element("dismiss-feedback").hidden = false;
  element("feedback-text").textContent = message;
  element("feedback").querySelector(".feedback-icon")!.textContent =
    state === "success" ? "✓" : state === "error" ? "!" : "i";
}

/** Dibuja la cartelera y las fechas, indicando el contexto seleccionado. */
function renderContext(): void {
  element("movies").innerHTML = movieTitles
    .map(
      (title, index) => `
    <button class="movie-card ${index === movie ? "active" : ""}" data-movie="${index}" aria-pressed="${index === movie}" aria-label="Elegir película: ${title}">
      <div class="poster"><img src="/posters/movie-${index}.jpg" alt="Póster de ${title}" width="500" height="750" /><span class="movie-format">2D · VOSE</span><span class="movie-check" aria-hidden="true">✓</span></div>
      <div class="movie-copy"><span class="movie-tag">${movieTags[index]}</span><h3>${title}</h3><p>${movieGenres[index]}</p></div>
    </button>`,
    )
    .join("");
  element("dates").innerHTML = dayNames
    .map(
      (name, index) =>
        `<button class="date ${index === day ? "active" : ""}" data-day="${index}" aria-pressed="${index === day}" aria-label="${7 + index} de noviembre, ${name}"><span>Nov</span><strong>${String(7 + index).padStart(2, "0")}</strong><span>${name}</span></button>`,
    )
    .join("");
  element("summary-movie").textContent = movieTitles[movie];
  element("summary-session").textContent =
    `${7 + day} nov · ${element<HTMLSelectElement>("time").value} · Sala 01`;
}

/** Sincroniza el mapa de butacas y el resumen con la matriz y la selección. */
function renderSeats(): void {
  const room = currentRoom();
  let html = '<span class="grid-corner" aria-hidden="true"></span>';
  for (let column = 0; column < 10; column++)
    html += `<span class="column-label" aria-hidden="true">${column}</span>`;
  for (let row = 0; row < room.length; row++) {
    html += `<span class="row-label" aria-hidden="true">${row}</span>`;
    for (let column = 0; column < room[row].length; column++) {
      const chosen = selected.some(
        (position) => position[0] === row && position[1] === column,
      );
      const occupied = room[row][column] === 1;
      html += `<button class="seat ${occupied ? "occupied" : chosen ? "chosen" : "available"}" data-row="${row}" data-column="${column}" aria-label="Fila ${row}, asiento ${column}: ${occupied ? "ocupado" : chosen ? "seleccionado" : "libre"}" aria-pressed="${chosen}" aria-disabled="${occupied}" title="Fila ${row} · Asiento ${column}"><span class="chair" aria-hidden="true"><span>${occupied ? "×" : chosen ? "✓" : ""}</span></span></button>`;
    }
  }
  element("seat-map").innerHTML = html;
  element("selected-seats").innerHTML = selected.length
    ? selected
        .map(
          (position) =>
            `<span class="seat-chip">${position[0]} · ${position[1]}</span>`,
        )
        .join("")
    : '<p class="muted text-sm">Aún no has elegido tu sitio.</p>';
  element("selection-count").textContent = String(selected.length);
  element("selected-total").textContent = String(selected.length);
  const book = element<HTMLButtonElement>("book");
  book.disabled = selected.length === 0;
  book.textContent = selected.length
    ? `Confirmar ${selected.length === 1 ? "1 asiento" : `${selected.length} asientos`} →`
    : "Selecciona un asiento";
  element<HTMLButtonElement>("clear").disabled = !selected.length;
  element("available-count").textContent = String(countSeats(room)[1]);
}

/** Cambia de sesión sin mezclar las reservas de películas, fechas u horas distintas. */
function changeSession(): void {
  selected = [];
  renderContext();
  renderSeats();
  feedback(
    "Sesión actualizada. Sus reservas se conservan durante esta visita; elige tus asientos.",
  );
}

element("movies").addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
    "[data-movie]",
  );
  if (!button || Number(button.dataset.movie) === movie) return;
  movie = Number(button.dataset.movie);
  changeSession();
  element("movies")
    .querySelector<HTMLButtonElement>(`[data-movie="${movie}"]`)
    ?.focus();
});
element("dates").addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
    "[data-day]",
  );
  if (!button || Number(button.dataset.day) === day) return;
  day = Number(button.dataset.day);
  changeSession();
  element("dates")
    .querySelector<HTMLButtonElement>(`[data-day="${day}"]`)
    ?.focus();
});
element<HTMLSelectElement>("time").addEventListener("change", () => {
  time = element<HTMLSelectElement>("time").selectedIndex;
  changeSession();
});
element("seat-map").addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
    "[data-row]",
  );
  if (!button) return;
  const row = Number(button.dataset.row);
  const column = Number(button.dataset.column);
  if (currentRoom()[row][column] === 1) {
    feedback(
      `El asiento ${row} · ${column} ya está ocupado. Elige un asiento libre.`,
      "error",
    );
    return;
  }
  const existing = selected.findIndex(
    (position) => position[0] === row && position[1] === column,
  );
  if (existing >= 0) selected.splice(existing, 1);
  else selected.push([row, column]);
  renderSeats();
  element("seat-map")
    .querySelector<HTMLButtonElement>(
      `[data-row="${row}"][data-column="${column}"]`,
    )
    ?.focus();
  feedback(
    existing >= 0
      ? `Asiento ${row} · ${column} retirado de la selección.`
      : `Asiento ${row} · ${column} seleccionado. Confirma la reserva cuando termines.`,
  );
});
element("find-pair").addEventListener("click", () => {
  const pair = findAdjacentSeats(currentRoom());
  if (!pair) {
    feedback(
      countSeats(currentRoom())[1] === 0
        ? "Sala completa. No quedan asientos disponibles en esta sesión."
        : "No hay dos asientos libres contiguos. Puedes reservar asientos individuales.",
      "error",
    );
    return;
  }
  selected = pair;
  renderSeats();
  feedback(
    `Pareja encontrada: fila ${pair[0][0]}, asientos ${pair[0][1]} y ${pair[1][1]}. Pulsa Confirmar para reservar.`,
    "success",
  );
});
element("clear").addEventListener("click", () => {
  selected = [];
  renderSeats();
  feedback("Selección limpiada. Las reservas confirmadas se conservan.");
});
element("book").addEventListener("click", () => {
  if (!selected.length) return;
  const labels = selected
    .map((position) => `${position[0]} · ${position[1]}`)
    .join(", ");
  for (const [row, column] of selected) reserveSeat(currentRoom(), row, column);
  selected = [];
  renderSeats();
  feedback(
    `Reserva confirmada. Tus asientos: ${labels}. ¡Disfruta de la película!`,
    "success",
  );
});
element("load-scenario").addEventListener("click", () => {
  const scenario = Number(element<HTMLSelectElement>("scenario").value);
  if (
    !window.confirm(
      "¿Sustituir los asientos de esta sesión por el escenario de prueba?",
    )
  )
    return;
  sessions[sessionIndex()] = createScenario(scenario);
  selected = [];
  renderSeats();
  feedback(
    `Escenario cargado. ${countSeats(currentRoom())[1]} asientos disponibles en esta sesión.`,
  );
});
element("dismiss-feedback").addEventListener("click", () => {
  element("feedback").classList.remove("floating");
  element("dismiss-feedback").hidden = true;
});
renderContext();
renderSeats();
