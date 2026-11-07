import "./style.css";
import { createScenario, reserveSeat } from "./cinema";
import type { Position, Room } from "./cinema";
import {
  countBookableSeats,
  findAccessiblePair,
  findStandardPair,
  getSeatKind,
  validateSelection,
  wheelchairFor,
} from "./seat-layout";

const wheelchairIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4" r="2"/><path d="m10 7-1 7h7l3 6h3M10 10h7M7 10a6 6 0 1 0 7 9"/></svg>';

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
const dayNames = ["Sáb", "Dom", "Lun", "Mar", "Mié", "Jue", "Vie"];
const sessions: Room[] = [];
for (let session = 0; session < 84; session++) sessions.push(createScenario(1));
let movie = 0;
let day = 0;
let time = 1;
let selected: Position[] = [];
let focusedRow = 0;
let focusedColumn = 0;

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
  element("feedback").className = `feedback ${state}`;
  element("dismiss-feedback").hidden = true;
  element("feedback-text").textContent = message;
  element("feedback").querySelector(".feedback-icon")!.textContent =
    state === "success" ? "✓" : state === "error" ? "!" : "i";
}

/** Dibuja la cartelera y las fechas, indicando el contexto seleccionado. */
function renderContext(): void {
  element<HTMLImageElement>("hero-backdrop").src =
    `/backdrops/movie-${movie}.jpg`;
  element("page-title").textContent = movieTitles[movie];
  element("hero-genre").textContent = movieGenres[movie];
  element("hero-index").textContent =
    `${String(movie + 1).padStart(2, "0")} / 04`;
  element("movies").innerHTML = movieTitles
    .map(
      (title, index) => `
    <button class="movie-card ${index === movie ? "active" : ""}" data-movie="${index}" aria-pressed="${index === movie}" aria-label="Elegir película: ${title}">
      <div class="poster"><img src="/posters/movie-${index}.jpg" alt="Póster de ${title}" width="500" height="750" /><span class="movie-check" aria-hidden="true">✓</span></div>
      <div class="movie-copy"><h3>${title}</h3><p>${movieGenres[index]}</p></div>
    </button>`,
    )
    .join("");
  element("dates").innerHTML = dayNames
    .map(
      (name, index) =>
        `<button class="date ${index === day ? "active" : ""}" data-day="${index}" aria-pressed="${index === day}" aria-label="${7 + index} de noviembre, ${name}"><span>Nov</span><strong>${String(7 + index).padStart(2, "0")}</strong><span>${name}</span></button>`,
    )
    .join("");
  element<HTMLImageElement>("summary-poster").src =
    `/posters/movie-${movie}.jpg`;
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
      const kind = getSeatKind(row, column);
      const blocked = kind === "blocked";
      const occupied = !blocked && room[row][column] === 1;
      const state = blocked
        ? "blocked"
        : occupied
          ? "occupied"
          : chosen
            ? "chosen"
            : "available";
      const label = blocked
        ? "bloqueado"
        : occupied
          ? "ocupado"
          : chosen
            ? "seleccionado"
            : "libre";
      const typeLabel =
        kind === "wheelchair"
          ? ", plaza para silla de ruedas"
          : kind === "companion"
            ? ", acompañante"
            : "";
      const symbol =
        kind === "wheelchair"
          ? `<span class="special-place">${wheelchairIcon}</span>`
          : kind === "companion"
            ? '<span class="special-place companion-symbol">A</span>'
            : '<span class="chair"><span></span></span>';
      const mark = blocked
        ? '<span class="seat-state-mark">／</span>'
        : occupied
          ? '<span class="seat-state-mark">×</span>'
          : chosen
            ? '<span class="seat-state-mark">✓</span>'
            : "";
      html += `<button class="seat ${state} ${kind}" data-row="${row}" data-column="${column}" aria-label="Fila ${row}, asiento ${column}: ${label}${typeLabel}" aria-pressed="${chosen}" aria-disabled="${occupied || blocked}" title="Fila ${row} · Asiento ${column}: ${label}${typeLabel}"><span aria-hidden="true" class="seat-visual">${symbol}${mark}</span></button>`;
    }
  }
  element("seat-map").innerHTML = html;
  updateSeatTabIndex();
  element("selected-seats").innerHTML = selected.length
    ? selected
        .map(
          (position) =>
            `<button class="seat-chip" data-remove-row="${position[0]}" data-remove-column="${position[1]}" aria-label="Retirar fila ${position[0]}, asiento ${position[1]}">${getSeatKind(position[0], position[1]) === "wheelchair" ? wheelchairIcon : getSeatKind(position[0], position[1]) === "companion" ? '<span class="chip-type" aria-hidden="true">A</span>' : ""}F${position[0]} · A${position[1]}<span aria-hidden="true">×</span></button>`,
        )
        .join("")
    : '<p class="muted text-sm">Elige tus asientos en el mapa.</p>';
  element("selection-count").textContent = String(selected.length);
  const book = element<HTMLButtonElement>("book");
  book.disabled = selected.length === 0;
  book.textContent = selected.length
    ? `Confirmar ${selected.length === 1 ? "1 asiento" : `${selected.length} asientos`} →`
    : "Selecciona un asiento";
  element<HTMLButtonElement>("clear").disabled = !selected.length;
  element("available-count").textContent = String(countBookableSeats(room));
  element("mobile-count").textContent =
    `${selected.length} ${selected.length === 1 ? "asiento" : "asientos"}`;
  updateMobileReview();
}

/** Cambia de sesión sin mezclar las reservas de películas, fechas u horas distintas. */
function changeSession(): void {
  selected = [];
  renderContext();
  renderSeats();
  feedback("Sesión actualizada.");
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
  focusedRow = row;
  focusedColumn = column;
  const kind = getSeatKind(row, column);
  if (kind === "blocked") {
    feedback(
      `Fila ${row} · Asiento ${column}: bloqueado. No se puede reservar.`,
      "error",
    );
    return;
  }
  if (currentRoom()[row][column] === 1) {
    feedback(`Fila ${row} · Asiento ${column}: ocupado.`, "error");
    return;
  }
  const existing = selected.findIndex(
    (position) => position[0] === row && position[1] === column,
  );
  let removedSeats = 0;
  if (existing >= 0) removedSeats = removeSeat(row, column);
  else {
    const wheelchair = wheelchairFor(row, column);
    if (wheelchair) {
      if (currentRoom()[wheelchair[0]][wheelchair[1]] === 1) {
        feedback(
          "La plaza de silla de ruedas vinculada está ocupada. Elige otra pareja accesible.",
          "error",
        );
        return;
      }
      if (
        !selected.some((p) => p[0] === wheelchair[0] && p[1] === wheelchair[1])
      )
        selected.push(wheelchair);
    }
    selected.push([row, column]);
  }
  renderSeats();
  element("seat-map")
    .querySelector<HTMLButtonElement>(
      `[data-row="${row}"][data-column="${column}"]`,
    )
    ?.focus();
  feedback(
    existing >= 0
      ? removedSeats > 1
        ? "Plaza para silla de ruedas y acompañante retirados."
        : `Fila ${row} · Asiento ${column} retirado.`
      : kind === "companion"
        ? "Plaza para silla de ruedas y acompañante seleccionados."
        : kind === "wheelchair"
          ? `Fila ${row} · Plaza para silla de ruedas ${column} seleccionada.`
          : `Fila ${row} · Asiento ${column} seleccionado.`,
  );
});
element("find-pair").addEventListener("click", () => {
  const pair = findStandardPair(currentRoom());
  if (!pair) {
    feedback(
      countBookableSeats(currentRoom()) === 0
        ? "Sala completa. Prueba otra sesión."
        : "No hay dos asientos normales juntos. Puedes elegir plazas sueltas o una pareja accesible.",
      "error",
    );
    return;
  }
  selected = pair;
  renderSeats();
  feedback(
    `Fila ${pair[0][0]} · Asientos ${pair[0][1]} y ${pair[1][1]} seleccionados.`,
  );
});
element("find-accessible-pair").addEventListener("click", () => {
  const pair = findAccessiblePair(currentRoom());
  if (!pair) {
    feedback(
      "No queda una plaza de silla de ruedas con su acompañante libre. Prueba otra sesión.",
      "error",
    );
    return;
  }
  selected = pair;
  renderSeats();
  feedback(
    `Fila ${pair[0][0]} · Silla de ruedas ${pair[0][1]} y acompañante ${pair[1][1]} seleccionados.`,
  );
});

/** Retira una plaza y, si es accesible, también su acompañante dependiente. */
function removeSeat(row: number, column: number): number {
  const before = selected.length;
  selected = selected.filter((position) => {
    if (position[0] === row && position[1] === column) return false;
    const wheelchair = wheelchairFor(position[0], position[1]);
    return !wheelchair || wheelchair[0] !== row || wheelchair[1] !== column;
  });
  return before - selected.length;
}

element("clear").addEventListener("click", () => {
  selected = [];
  renderSeats();
  feedback("Selección vacía.");
});
element("book").addEventListener("click", () => {
  if (!selected.length) return;
  const invalid = validateSelection(currentRoom(), selected);
  if (invalid) {
    feedback(invalid, "error");
    return;
  }
  const labels = selected
    .map((position) => `${position[0]} · ${position[1]}`)
    .join(", ");
  for (const [row, column] of selected) reserveSeat(currentRoom(), row, column);
  element("receipt-movie").textContent = movieTitles[movie];
  element("receipt-session").textContent =
    element("summary-session").textContent;
  element("receipt-seats").textContent = selected
    .map(
      (position) =>
        `Fila ${position[0]} · ${getSeatKind(position[0], position[1]) === "wheelchair" ? "Silla de ruedas" : getSeatKind(position[0], position[1]) === "companion" ? "Acompañante" : "Asiento"} ${position[1]}`,
    )
    .join(" / ");
  selected = [];
  renderSeats();
  element<HTMLDialogElement>("booking-receipt").showModal();
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
    `Escenario cargado. ${countBookableSeats(currentRoom())} asientos disponibles en esta sesión.`,
  );
});
element("dismiss-feedback").addEventListener("click", () => {
  element("feedback").classList.remove("floating");
  element("dismiss-feedback").hidden = true;
});

/** Mantiene una sola entrada de Tab en el mapa y permite recorrerlo con flechas. */
function updateSeatTabIndex(): void {
  for (const button of element("seat-map").querySelectorAll<HTMLButtonElement>(
    "[data-row]",
  )) {
    button.tabIndex =
      Number(button.dataset.row) === focusedRow &&
      Number(button.dataset.column) === focusedColumn
        ? 0
        : -1;
  }
}

/** Muestra el acceso móvil al resumen sin taparlo mientras se consulta. */
function updateMobileReview(): void {
  const summary = element("reservation-summary").getBoundingClientRect();
  const visible = summary.top < window.innerHeight - 90 && summary.bottom > 100;
  element("mobile-review").hidden = selected.length === 0 || visible;
}
window.addEventListener("scroll", updateMobileReview, { passive: true });
window.addEventListener("resize", updateMobileReview);
element("hero-reserve").addEventListener("click", (event) => {
  event.preventDefault();
  element("schedule").scrollIntoView({ block: "start", behavior: "instant" });
  element("time").focus({ preventScroll: true });
});
element("review-selection").addEventListener("click", () => {
  element("reservation-summary").scrollIntoView({
    block: "start",
    behavior: "instant",
  });
  element("book").focus({ preventScroll: true });
});
element("seat-map").addEventListener("keydown", (event) => {
  const keyboard = event as KeyboardEvent;
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
    "[data-row]",
  );
  if (
    !button ||
    ![
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ].includes(keyboard.key)
  )
    return;
  keyboard.preventDefault();
  focusedRow = Number(button.dataset.row);
  focusedColumn = Number(button.dataset.column);
  if (keyboard.key === "ArrowLeft")
    focusedColumn = Math.max(0, focusedColumn - 1);
  if (keyboard.key === "ArrowRight")
    focusedColumn = Math.min(9, focusedColumn + 1);
  if (keyboard.key === "ArrowUp") focusedRow = Math.max(0, focusedRow - 1);
  if (keyboard.key === "ArrowDown") focusedRow = Math.min(7, focusedRow + 1);
  if (keyboard.key === "Home") focusedColumn = 0;
  if (keyboard.key === "End") focusedColumn = 9;
  updateSeatTabIndex();
  element("seat-map")
    .querySelector<HTMLButtonElement>(
      `[data-row="${focusedRow}"][data-column="${focusedColumn}"]`,
    )
    ?.focus();
});
element("selected-seats").addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
    "[data-remove-row]",
  );
  if (!button) return;
  const row = Number(button.dataset.removeRow);
  const column = Number(button.dataset.removeColumn);
  const removedSeats = removeSeat(row, column);
  renderSeats();
  const next =
    element("selected-seats").querySelector<HTMLButtonElement>("button");
  if (next) next.focus();
  else
    element("seat-map")
      .querySelector<HTMLButtonElement>('[tabindex="0"]')
      ?.focus();
  feedback(
    removedSeats > 1
      ? "Plaza para silla de ruedas y acompañante retirados."
      : `Fila ${row} · Asiento ${column} retirado.`,
  );
});
element("close-receipt").addEventListener("click", () => {
  element<HTMLDialogElement>("booking-receipt").close();
});
element("booking-receipt").addEventListener("close", () => {
  element("seat-map")
    .querySelector<HTMLButtonElement>('[tabindex="0"]')
    ?.focus();
});

renderContext();
renderSeats();
