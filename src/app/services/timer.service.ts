import { Injectable, NgZone } from '@angular/core';

/**
 * Servicio para manejar múltiples cronómetros (timers) simultáneos por ID.
 * Usado para medir tiempo por tareas u otras entidades.
 */
@Injectable({ providedIn: 'root' })
export class TimerService {
    private intervals: { [id: string]: any } = {};
    private elapsed: { [id: string]: number } = {};

    constructor(private zone: NgZone) { }

    /**
     * Inicia un cronómetro para un ID específico.
     * Si ya existe, no hace nada.
     * @param id Identificador único del cronómetro (ej: ID de una tarea)
     */
    start(id: string): void {
        if (this.intervals[id]) return;
        this.intervals[id] = setInterval(() => {
            this.zone.run(() => {
                this.elapsed[id] = (this.elapsed[id] || 0) + 1;
            });
        }, 1000);
    }

    /**
     * Detiene el cronómetro y devuelve el tiempo transcurrido.
     * Limpia automáticamente el cronómetro de memoria.
     * @param id Identificador del cronómetro
     * @returns Tiempo total transcurrido en segundos
     */
    stop(id: string): number {
        clearInterval(this.intervals[id]);
        delete this.intervals[id];
        const time = this.elapsed[id] || 0;
        delete this.elapsed[id];
        return time;
    }

    /**
     * Verifica si un cronómetro está activo.
     * @param id Identificador del cronómetro
     */
    isRunning(id: string): boolean {
        return !!this.intervals[id];
    }

    /**
     * Devuelve el tiempo transcurrido sin detener el cronómetro.
     * @param id Identificador del cronómetro
     * @returns Tiempo en segundos
     */
    getElapsed(id: string): number {
        return this.elapsed[id] || 0;
    }
}
