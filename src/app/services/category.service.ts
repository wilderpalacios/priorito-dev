import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

import { Category } from '../models/category.model';
import { StorageService } from './storage.service';

const CATEGORIES_KEY = 'categories';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    constructor(private storage: StorageService) { }

    /**
     * Obtiene todas las categorías almacenadas.
     * @returns Una promesa con la lista de categorías.
     */
    async getAll(): Promise<Category[]> {
        return (await this.storage.get<Category[]>(CATEGORIES_KEY)) || [];
    }

    /**
     * Agrega una nueva categoría al almacenamiento.
     * @param category Objeto parcial con nombre y color (requerido: name).
     */
    async add(category: Partial<Category>): Promise<void> {
        if (!category.name) {
            throw new Error('El nombre de la categoría es requerido');
        }

        const categories = await this.getAll();
        const newCategory: Category = {
            id: uuidv4(),
            name: category.name,
            color: category.color || '#cccccc',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        categories.push(newCategory);
        await this.storage.set(CATEGORIES_KEY, categories);
    }

    /**
     * Actualiza una categoría existente.
     * @param updated Categoría con ID válido y cambios.
     */
    async update(updated: Category): Promise<void> {
        if (!updated.id) return;

        const categories = await this.getAll();
        const index = categories.findIndex(c => c.id === updated.id);

        if (index > -1) {
            updated.updatedAt = new Date();
            categories[index] = updated;
            await this.storage.set(CATEGORIES_KEY, categories);
        }
    }

    /**
     * Elimina una categoría según su ID.
     * @param id ID de la categoría a eliminar.
     */
    async delete(id: string): Promise<void> {
        const categories = await this.getAll();
        const filtered = categories.filter(c => c.id !== id);
        await this.storage.set(CATEGORIES_KEY, filtered);
    }

    /**
     * Obtiene una categoría por su ID.
     * @param id ID de la categoría.
     * @returns Categoría encontrada o undefined.
     */
    async getById(id: string): Promise<Category | undefined> {
        const categories = await this.getAll();
        return categories.find(c => c.id === id);
    }
}
