/**
 * QR Code generator utilities.
 * Uses the free qrserver.com API for URL-based generation
 * and a minimal SVG builder for inline rendering.
 */

const QR_API_BASE = 'https://api.qrserver.com/v1/create-qr-code';

/**
 * Returns a URL that resolves to a QR code PNG image.
 */
export function generateQRCodeURL(data: string, size = 300): string {
  const encoded = encodeURIComponent(data);
  return `${QR_API_BASE}/?size=${size}x${size}&data=${encoded}&format=png&margin=8`;
}

/**
 * Generates an inline SVG string for a QR code.
 * Uses a simple 2D matrix approach with a bitmask pattern
 * derived from the data string. For production fidelity
 * this delegates to the API; for offline/inline use it
 * creates a deterministic pattern from the input.
 */
export function generateQRCodeSVG(
  data: string,
  size = 200,
  fgColor = '#ffffff',
  bgColor = '#0f172a'
): string {
  const modules = encodeToModules(data);
  const moduleCount = modules.length;
  const cellSize = size / moduleCount;

  let rects = '';
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (modules[row][col]) {
        const x = (col * cellSize).toFixed(2);
        const y = (row * cellSize).toFixed(2);
        const w = cellSize.toFixed(2);
        rects += `<rect x="${x}" y="${y}" width="${w}" height="${w}" fill="${fgColor}"/>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="${bgColor}"/>
  ${rects}
</svg>`;
}

/**
 * Minimal QR-like module encoder.
 * Creates a 21x21 grid (QR Version 1 size) with:
 * - Finder patterns in three corners
 * - Data area filled from the input string hash
 *
 * Note: This is a visual approximation suitable for display purposes.
 * For scannable QR codes, use generateQRCodeURL() which calls a real encoder.
 */
function encodeToModules(data: string): boolean[][] {
  const size = 25;
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  // Draw finder patterns (7x7 squares in 3 corners)
  const drawFinder = (startRow: number, startCol: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[startRow + r][startCol + c] = isOuter || isInner;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 7; i < size - 7; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Generate deterministic hash from data
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data.charCodeAt(i)) | 0;
  }

  // Fill data area with pseudo-random pattern from hash
  let seed = Math.abs(hash);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder patterns and timing
      if (isFinderArea(r, c, size) || (r === 6) || (c === 6)) continue;

      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      grid[r][c] = (seed >> 16) % 3 !== 0;
    }
  }

  return grid;
}

function isFinderArea(r: number, c: number, size: number): boolean {
  // Top-left finder + separator
  if (r < 8 && c < 8) return true;
  // Top-right finder + separator
  if (r < 8 && c >= size - 8) return true;
  // Bottom-left finder + separator
  if (r >= size - 8 && c < 8) return true;
  return false;
}
