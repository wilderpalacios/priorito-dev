/**
 * Formatea segundos a mm:ss
 */
export function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${pad(minutes)}:${pad(remaining)}`;
}

function pad(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
}
