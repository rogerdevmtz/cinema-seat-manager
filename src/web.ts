import "./style.css";
import { movieDetails } from "./movie-details";
import { createTicketSvg } from "./ticket";
import type { Ticket } from "./ticket";
import { createScenario, reserveSeat } from "./cinema";
import type { Position, Room } from "./cinema";
import {
  countBookableSeats,
  findStandardPair,
  validateSelection,
} from "./seat-layout";

/** Iconos vectoriales locales con el mismo trazo en todos los controles. */
function icon(name: string): string {
  return `<svg class="icon" aria-hidden="true"><use href="/icons.svg#${name}"></use></svg>`;
}

/** Butaca vectorial compartida por el plano y la leyenda. */
function cinemaSeat(): string {
  return `<svg class="cinema-chair" viewBox="0 0 32 32" aria-hidden="true">
    <path class="chair-feet" d="M8 25h4v4H8zm12 0h4v4h-4z"/>
    <rect class="chair-back" x="7" y="3" width="18" height="20" rx="5"/>
    <path class="chair-seam" d="M11 7h10M10 19h12"/>
    <rect class="chair-cushion" x="5" y="21" width="22" height="5" rx="2"/>
    <rect class="chair-arm" x="2.5" y="14" width="5" height="12" rx="2.3"/>
    <rect class="chair-arm" x="24.5" y="14" width="5" height="12" rx="2.3"/>
  </svg>`;
}

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
const showtimes = ["10:30", "18:00", "21:30"];
const sessions: Room[] = [];
for (let session = 0; session < 84; session++) sessions.push(createScenario(1));
let movie = 0;
let day = 0;
let time = 1;
let selected: Position[] = [];
let previousSelection: [number, number, number, Position[]] | null = null;
let lastTicket: Ticket | null = null;
let ticketOpenedFromHeader = false;
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
  previousSelection = null;
  element("undo-session").hidden = true;
  element("feedback").className = `feedback ${state}`;
  element("dismiss-feedback").hidden = true;
  element("feedback-text").textContent = message;
  element("feedback").querySelector(".feedback-icon")!.innerHTML = icon(
    state === "success" ? "check" : state === "error" ? "ban" : "info",
  );
  if (state === "error") revealImportantFeedback();
}

/** Acerca los errores y la acción Deshacer cuando el aviso queda fuera de la vista móvil. */
function revealImportantFeedback(): void {
  if (window.innerWidth > 760) return;
  const notice = element("feedback");
  const bounds = notice.getBoundingClientRect();
  const reservedBottom = element("mobile-review").hidden ? 12 : 88;
  if (bounds.top < 0 || bounds.bottom > window.innerHeight - reservedBottom) {
    notice.classList.add("floating");
    element("dismiss-feedback").hidden = false;
  }
}

/** Dibuja la cartelera y las fechas, indicando el contexto seleccionado. */
function renderContext(): void {
  element<HTMLImageElement>("hero-backdrop").src =
    `/posters/movie-${movie}.jpg`;
  element<HTMLImageElement>("hero-backdrop").alt = `Póster de ${movieTitles[movie]}`;
  element("watch-trailer").setAttribute("aria-label", `Ver tráiler de ${movieTitles[movie]}`);
  element("page-title").textContent = movieTitles[movie];
  element("details-title").textContent = movieTitles[movie];
  element("hero-genre").textContent = movieGenres[movie];
  const [duration, year, director, cast, synopsis, trailer, source] =
    movieDetails[movie];
  element("hero-runtime").innerHTML =
    `${icon("clock")}<span>${duration}</span>`;
  element("hero-year").textContent = year;
  element("hero-synopsis").textContent = synopsis;
  element("movie-director").textContent = director;
  element("movie-cast").textContent = cast;
  element<HTMLAnchorElement>("movie-source").href = source;
  element<HTMLAnchorElement>("trailer-external").href =
    `https://www.youtube.com/watch?v=${trailer}`;
  element("hero-index").textContent =
    `${String(movie + 1).padStart(2, "0")} / 04`;
  element("movies").innerHTML = movieTitles
    .map(
      (title, index) => `
    <button class="movie-card ${index === movie ? "active" : ""}" data-movie="${index}" aria-pressed="${index === movie}" aria-label="Elegir película: ${title}">
      <div class="poster"><img src="/posters/movie-${index}.jpg" alt="Póster de ${title}" width="500" height="750" /><span class="movie-check" aria-hidden="true">${icon("check")}</span></div>
      <div class="movie-copy"><h3>${title}</h3><span class="movie-duration">${icon("clock")}${movieDetails[index][0]}</span></div>
    </button>`,
    )
    .join("");
  element("dates").innerHTML = dayNames
    .map(
      (name, index) =>
        `<button class="date ${index === day ? "active" : ""}" data-day="${index}" aria-pressed="${index === day}" aria-label="${7 + index} de noviembre, ${name}"><span>${name}</span><strong>${String(7 + index).padStart(2, "0")}</strong></button>`,
    )
    .join("");
  element("time").innerHTML = showtimes.map((hour, index) =>
    `<button class="showtime ${index === time ? "active" : ""}" data-time="${index}" aria-pressed="${index === time}" aria-label="Sesión de las ${hour}">${hour}</button>`,
  ).join("");
  element("summary-movie").textContent = movieTitles[movie];
  element("summary-session").textContent =
    `${7 + day} nov · ${showtimes[time]} · Sala 01`;
}

/** Presenta los datos de la plaza como una entrada; solo la cruz permite retirarla. */
function selectedSeatRow([row, column]: Position): string {
  return `<div class="ticket-seat">
    <span class="ticket-seat-kind" aria-hidden="true">${icon("seats")}</span>
    <span class="seat-coordinate"><span>Fila</span><strong>${row}</strong></span>
    <span class="seat-coordinate"><span>Asiento</span><strong>${String(column).padStart(2, "0")}</strong></span>
    <button class="seat-chip remove-seat" data-remove-row="${row}" data-remove-column="${column}" aria-label="Retirar fila ${row}, asiento ${column}">${icon("close")}</button>
  </div>`;
}

/** Sincroniza el mapa de butacas y el resumen con la matriz y la selección. */
function renderSeats(): void {
  const room = currentRoom();
  const gridColumn = (column: number): number => column + 2;
  let html = "";
  for (let column = 0; column < 10; column++)
    html += `<span class="column-label" style="grid-column:${gridColumn(column)};grid-row:1" aria-hidden="true">${column}</span>`;
  for (let row = 0; row < room.length; row++) {
    const gridRow = row + 2;
    html += `<span class="row-label" style="grid-column:1;grid-row:${gridRow}" aria-hidden="true">${row}</span>`;
    for (let column = 0; column < room[row].length; column++) {
      const chosen = selected.some(
        (position) => position[0] === row && position[1] === column,
      );
      const occupied = room[row][column] === 1;
      const state = occupied ? "occupied" : chosen ? "chosen" : "available";
      const label = occupied ? "ocupado" : chosen ? "seleccionado" : "libre";
      const symbol = cinemaSeat();
      const mark = occupied || chosen
        ? `<span class="seat-state-mark">${icon(occupied ? "close" : "check")}</span>`
        : "";
      html += `<button class="seat ${state}" style="grid-column:${gridColumn(column)};grid-row:${gridRow}" data-row="${row}" data-column="${column}" aria-label="Fila ${row}, asiento ${column}: ${label}" aria-pressed="${chosen}" aria-disabled="${occupied}" title="Fila ${row} · Asiento ${column}: ${label}"><span aria-hidden="true" class="seat-visual">${symbol}${mark}</span></button>`;
    }
  }
  element("seat-map").innerHTML = html;
  updateSeatTabIndex();
  element("selected-seats").innerHTML = selected.length
    ? selected.map(selectedSeatRow).join("")
    : `<div class="selection-empty">${icon("seats")}<p>Selecciona tus asientos en el plano.</p></div>`;
  element("selection-count").textContent = String(selected.length);
  element("selection-count").hidden = selected.length === 0;
  const book = element<HTMLButtonElement>("book");
  book.disabled = selected.length === 0;
  book.innerHTML = selected.length
    ? `Confirmar ${selected.length === 1 ? "1 asiento" : `${selected.length} asientos`}${icon("arrow-right")}`
    : "Confirmar reserva";
  element<HTMLButtonElement>("clear").disabled = !selected.length;
  element("clear").hidden = !selected.length;
  element("available-count").textContent = String(countBookableSeats(room));
  element("available-count").parentElement!.classList.toggle("sold-out", countBookableSeats(room) === 0);
  element("mobile-count").textContent =
    `${selected.length} ${selected.length === 1 ? "asiento" : "asientos"}`;
  updateMobileReview();
}

/** Cambia de sesión sin mezclar las reservas de películas, fechas u horas distintas. */
function changeSession(nextMovie = movie, nextDay = day, nextTime = time): void {
  const previous: [number, number, number, Position[]] = [movie, day, time, [...selected]];
  movie = nextMovie;
  day = nextDay;
  time = nextTime;
  selected = [];
  renderContext();
  renderSeats();
  feedback(previous[3].length
    ? "Sesión cambiada. Se ha retirado tu selección anterior."
    : `${7 + day} de noviembre · ${showtimes[time]}. Elige tus asientos.`);
  if (previous[3].length) {
    previousSelection = previous;
    element("undo-session").hidden = false;
    revealImportantFeedback();
  }
}

element("change-movie").addEventListener("click", () => {
  element<HTMLDialogElement>("movie-picker").showModal();
  element("movies").querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus();
});
element("close-movie-picker").addEventListener("click", () => {
  element<HTMLDialogElement>("movie-picker").close();
});
element("movie-picker").addEventListener("close", () => element("change-movie").focus());
element("movies").addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
    "[data-movie]",
  );
  if (!button) return;
  if (Number(button.dataset.movie) !== movie) changeSession(Number(button.dataset.movie));
  element<HTMLDialogElement>("movie-picker").close();
});
element("dates").addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
    "[data-day]",
  );
  if (!button || Number(button.dataset.day) === day) return;
  changeSession(movie, Number(button.dataset.day));
  element("dates")
    .querySelector<HTMLButtonElement>(`[data-day="${day}"]`)
    ?.focus();
});
element("time").addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-time]");
  if (!button || Number(button.dataset.time) === time) return;
  changeSession(movie, day, Number(button.dataset.time));
  element("time").querySelector<HTMLButtonElement>(`[data-time="${time}"]`)?.focus();
});

/** Recupera la selección pendiente y su sesión tras un cambio accidental. */
element("undo-session").addEventListener("click", () => {
  if (!previousSelection) return;
  [movie, day, time, selected] = previousSelection;
  renderContext();
  renderSeats();
  feedback("Sesión y asientos recuperados.", "success");
  element("book").focus({ preventScroll: true });
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
  if (currentRoom()[row][column] === 1) {
    feedback(`Fila ${row} · Asiento ${column}: ocupado.`, "error");
    return;
  }
  const existing = selected.findIndex(
    (position) => position[0] === row && position[1] === column,
  );
  if (existing >= 0) removeSeat(row, column);
  else selected.push([row, column]);
  renderSeats();
  element("seat-map")
    .querySelector<HTMLButtonElement>(
      `[data-row="${row}"][data-column="${column}"]`,
    )
    ?.focus();
  feedback(`Fila ${row} · Asiento ${column} ${existing >= 0 ? "retirado" : "seleccionado"}.`);
});
element("find-pair").addEventListener("click", () => {
  const pair = findStandardPair(currentRoom());
  if (!pair) {
    feedback(
      countBookableSeats(currentRoom()) === 0
        ? "Sala completa. Prueba otra sesión."
        : "No hay dos butacas juntas. Puedes elegir plazas sueltas.",
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
/** Retira únicamente la butaca elegida. */
function removeSeat(row: number, column: number): number {
  const before = selected.length;
  selected = selected.filter((position) => position[0] !== row || position[1] !== column);
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
        `Fila ${position[0]} · Asiento ${position[1]}`,
    )
    .join(" / ");
  ticketOpenedFromHeader = false;
  const reference = `RM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  lastTicket = [
    reference,
    movieTitles[movie],
    element("receipt-session").textContent || "",
    element("receipt-seats").textContent || "",
  ];
  element("ticket-reference").textContent = reference;
  element("open-ticket").hidden = false;
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
  element<HTMLDialogElement>("demo-dialog").close();
  feedback(
    `Escenario cargado. ${countBookableSeats(currentRoom())} asientos disponibles en esta sesión.`,
  );
});

element("open-demo").addEventListener("click", () => element<HTMLDialogElement>("demo-dialog").showModal());
element("close-demo").addEventListener("click", () => element<HTMLDialogElement>("demo-dialog").close());
element("demo-dialog").addEventListener("close", () => element("open-demo").focus());
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
  if (window.innerWidth > 760) {
    element("feedback").classList.remove("floating");
    element("dismiss-feedback").hidden = true;
  }
  const summary = element("reservation-summary").getBoundingClientRect();
  const visible = summary.top < window.innerHeight - 90 && summary.bottom > 100;
  element("mobile-review").hidden = selected.length === 0 || visible;
}
window.addEventListener("scroll", updateMobileReview, { passive: true });
window.addEventListener("resize", updateMobileReview);
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
  removeSeat(row, column);
  renderSeats();
  const next =
    element("selected-seats").querySelector<HTMLButtonElement>("button");
  if (next) next.focus();
  else
    element("seat-map")
      .querySelector<HTMLButtonElement>('[tabindex="0"]')
      ?.focus();
  feedback(`Fila ${row} · Asiento ${column} retirado.`);
});
element("close-receipt").addEventListener("click", () => {
  element<HTMLDialogElement>("booking-receipt").close();
});
element("booking-receipt").addEventListener("close", () => {
  if (ticketOpenedFromHeader) {
    element("open-ticket").focus();
    return;
  }
  element("seat-map")
    .querySelector<HTMLButtonElement>('[tabindex="0"]')
    ?.focus();
});

element("show-film-info").addEventListener("click", () =>
  element<HTMLDialogElement>("movie-info").showModal(),
);
element("close-film-info").addEventListener("click", () =>
  element<HTMLDialogElement>("movie-info").close(),
);
element("movie-info").addEventListener("close", () =>
  element("show-film-info").focus(),
);

/** Abre el tráiler solicitado y elimina el reproductor al cerrar para detenerlo. */
element("watch-trailer").addEventListener("click", () => {
  element("trailer-title").textContent = movieTitles[movie];
  element("trailer-player").innerHTML =
    `<iframe title="Tráiler oficial de ${movieTitles[movie]}" src="https://www.youtube-nocookie.com/embed/${movieDetails[movie][5]}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  element<HTMLDialogElement>("trailer-dialog").showModal();
});
element("close-trailer").addEventListener("click", () =>
  element<HTMLDialogElement>("trailer-dialog").close(),
);
element("trailer-dialog").addEventListener("close", () => {
  element("trailer-player").replaceChildren();
  element("watch-trailer").focus();
});

/** Recupera la última entrada de la visita sin confirmar ni duplicar reservas. */
element("open-ticket").addEventListener("click", () => {
  if (!lastTicket) return;
  ticketOpenedFromHeader = true;
  element("ticket-reference").textContent = lastTicket[0];
  element("receipt-movie").textContent = lastTicket[1];
  element("receipt-session").textContent = lastTicket[2];
  element("receipt-seats").textContent = lastTicket[3];
  element<HTMLDialogElement>("booking-receipt").showModal();
});

/** Descarga una entrada SVG autónoma, conservando la referencia y los asientos confirmados. */
element("download-ticket").addEventListener("click", async () => {
  if (!lastTicket) return;
  const confirmed = [...lastTicket] as Ticket;
  const button = element<HTMLButtonElement>("download-ticket");
  button.disabled = true;
  try {
    let logo = "";
    try {
      const response = await fetch("/roger-martinez-logo-transparent.svg");
      if (response.ok)
        logo = `data:image/svg+xml,${encodeURIComponent(await response.text())}`;
    } catch {
      /* La entrada tiene una marca de texto si no se puede cargar el logo. */
    }
    const url = URL.createObjectURL(
      new Blob([createTicketSvg(confirmed, logo)], {
        type: "image/svg+xml;charset=utf-8",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `entrada-${confirmed[0]}.svg`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  } finally {
    button.disabled = false;
  }
});

// Los mismos dibujos y colores de las butacas permiten interpretar la leyenda sin traducir símbolos.
for (const state of ["available", "chosen", "occupied"]) {
  const sample = document.querySelector<HTMLElement>(`.mini-seat.${state}`);
  if (sample) sample.innerHTML = cinemaSeat() +
    (state === "chosen" || state === "occupied" ? `<span class="seat-state-mark">${icon(state === "chosen" ? "check" : "close")}</span>` : "");
}
renderContext();
renderSeats();
