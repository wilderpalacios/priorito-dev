import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';


@Injectable({
    providedIn: 'root',
})
export class StorageService {
    private _storage: Storage | null = null;
    private cache = new Map<string, any>();

    constructor(private storage: Storage) {
        this.init();
    }

    /**
     * Inicializa el sistema de almacenamiento de Ionic.
     */
    private async init(): Promise<void> {
        this._storage = await this.storage.create();
    }

    /**
     * Guarda un valor en almacenamiento y en caché.
     * @param key Clave a almacenar
     * @param value Valor a guardar
     */
    public async set<T = any>(key: string, value: T): Promise<void> {
        this.cache.set(key, value);
        await this._storage?.set(key, value);
    }

    /**
     * Recupera un valor de la caché o del almacenamiento si no está en caché.
     * @param key Clave del valor a obtener
     * @returns Valor almacenado o null si no existe
     */
    public async get<T = any>(key: string): Promise<T | null> {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }

        const value = await this._storage?.get(key);
        if (value !== null && value !== undefined) {
            this.cache.set(key, value);
        }

        return value ?? null;
    }

    /**
     * Elimina un valor del almacenamiento y del caché.
     * @param key Clave a eliminar
     */
    public async remove(key: string): Promise<void> {
        this.cache.delete(key);
        await this._storage?.remove(key);
    }

    /**
     * Limpia el almacenamiento local y la caché interna.
     */
    public async clear(): Promise<void> {
        this.cache.clear();
        await this._storage?.clear();
    }

    /**
     * Verifica si una clave existe en el caché o en el almacenamiento.
     * Si no está en caché, realiza una consulta.
     * @param key Clave a verificar
     */
    public async has(key: string): Promise<boolean> {
        if (this.cache.has(key)) return true;
        const value = await this._storage?.get(key);
        if (value !== null && value !== undefined) {
            this.cache.set(key, value);
            return true;
        }
        return false;
    }
}
