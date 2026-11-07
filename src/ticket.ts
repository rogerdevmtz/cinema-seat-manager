export type Ticket = [
  reference: string,
  movie: string,
  session: string,
  seats: string,
];

/** Escapa contenido para que la entrada siga siendo un SVG seguro y válido. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Ajusta líneas sin cortar palabras y permite entradas con muchos asientos. */
function wrap(value: string, length: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of value.split(/\s+/)) {
    if (line && line.length + word.length + 1 > length) {
      lines.push(line);
      line = word;
    } else line += (line ? " " : "") + word;
  }
  if (line) lines.push(line);
  return lines;
}

/** Crea una entrada guardable, explícitamente de demostración y sin códigos falsos. */
export function createTicketSvg(ticket: Ticket, logoData = ""): string {
  const [reference, title, session, seats] = ticket;
  const titleLines = wrap(title, 37);
  const seatLines = wrap(seats, 68);
  const sessionTop = 172 + titleLines.length * 43;
  const seatsTop = sessionTop + 100;
  const height = Math.max(540, seatsTop + seatLines.length * 27 + 105);
  const logo = logoData
    ? `<image href="${escapeXml(logoData)}" x="44" y="20" width="210" height="62"/>`
    : '<text x="44" y="60" fill="white" font-size="24" font-weight="700">R. MARTÍNEZ</text>';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="${height}" viewBox="0 0 900 ${height}" role="img" aria-labelledby="title"><title id="title">Entrada de demostración: ${escapeXml(title)}</title><rect width="900" height="${height}" rx="22" fill="#f7f9ff"/><path d="M22 0h856a22 22 0 0 1 22 22v88H0V22A22 22 0 0 1 22 0" fill="#0a142b"/>${logo}<text x="856" y="48" text-anchor="end" font-family="Arial,sans-serif" font-size="11" letter-spacing="2" fill="#aac5ff">ENTRADA DE CINE</text><text x="856" y="74" text-anchor="end" font-family="Arial,sans-serif" font-size="15" fill="white">${escapeXml(reference)}</text><g font-family="Arial,sans-serif"><text x="44" y="151" fill="#315ba0" font-size="11" letter-spacing="2">PELÍCULA</text>${titleLines.map((line, index) => `<text x="44" y="${188 + index * 43}" fill="#111c33" font-size="34" font-weight="700">${escapeXml(line)}</text>`).join("")}<path d="M44 ${sessionTop - 4}h812" stroke="#c1cee2" stroke-dasharray="5 5"/><text x="44" y="${sessionTop + 29}" fill="#315ba0" font-size="11" letter-spacing="2">SESIÓN</text><text x="44" y="${sessionTop + 60}" fill="#162949" font-size="23">${escapeXml(session)}</text><text x="44" y="${seatsTop + 15}" fill="#315ba0" font-size="11" letter-spacing="2">ASIENTOS</text>${seatLines.map((line, index) => `<text x="44" y="${seatsTop + 46 + index * 27}" fill="#162949" font-size="18">${escapeXml(line)}</text>`).join("")}<rect x="28" y="${height - 65}" width="844" height="43" rx="8" fill="#e5ecfb"/><text x="450" y="${height - 39}" text-anchor="middle" font-size="11" letter-spacing="1" fill="#314a73">DEMOSTRACIÓN · SIN VALIDEZ PARA ACCESO AL CINE</text></g></svg>`;
}
