/**
 * Genera un arreglo de colores aleatorios en formato hexadecimal.
 *
 * @param count - Cantidad de colores a generar (por defecto 10).
 * @returns Array de strings en formato HEX, como ['#58c091', '#ab23ef', ...]
 */
export function generateRandomColors(count: number = 10): string[] {
    const colors: string[] = [];

    for (let i = 0; i < count; i++) {
        const hue = Math.floor(Math.random() * 360); // Ángulo HSL
        const saturation = Math.floor(Math.random() * 30) + 60; // 60% - 90%
        const lightness = Math.floor(Math.random() * 20) + 60;  // 60% - 80%

        const hex = hslToHex(hue, saturation, lightness);
        colors.push(hex);
    }

    return colors;
}

/**
 * Convierte un color en formato HSL a hexadecimal.
 *
 * @param h - Hue (matiz), de 0 a 360.
 * @param s - Saturación (0-100).
 * @param l - Luminosidad (0-100).
 * @returns Color convertido en formato HEX (ej: #58c091).
 */
function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));

    return `#${f(0).toString(16).padStart(2, '0')}${f(8).toString(16).padStart(2, '0')}${f(4)
        .toString(16)
        .padStart(2, '0')}`;
}
