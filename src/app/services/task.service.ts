import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

import { Task } from '../models/task.model';
import { StorageService } from './storage.service';

const TASKS_KEY = 'tasks';


@Injectable({
    providedIn: 'root',
})
export class TaskService {
    constructor(private storage: StorageService) { }

    /**
     * Obtiene todas las tareas almacenadas.
     * @returns Lista de tareas o array vacío.
     */
    async getAll(): Promise<Task[]> {
        return (await this.storage.get<Task[]>(TASKS_KEY)) || [];
    }

    /**
     * Agrega una nueva tarea.
     * @param task Objeto parcial con campos obligatorios `title` y `categoryId`.
     */
    async add(task: Partial<Task>): Promise<void> {
        if (!task.title || !task.categoryId) {
            throw new Error('Título y categoría son requeridos');
        }

        const tasks = await this.getAll();

        const newTask: Task = {
            id: uuidv4(),
            title: task.title,
            description: task.description || '',
            categoryId: task.categoryId,
            isCompleted: false,
            timeSpentInSeconds: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        tasks.push(newTask);
        await this.storage.set(TASKS_KEY, tasks);
    }

    /**
     * Actualiza una tarea existente.
     * @param updatedTask Tarea con ID y campos actualizados.
     */
    async update(updatedTask: Task): Promise<void> {
        const tasks = await this.getAll();
        const index = tasks.findIndex(t => t.id === updatedTask.id);

        if (index > -1) {
            updatedTask.updatedAt = new Date();
            tasks[index] = updatedTask;
            await this.storage.set(TASKS_KEY, tasks);
        }
    }

    /**
     * Elimina una tarea por su ID.
     * @param taskId ID de la tarea a eliminar.
     */
    async delete(taskId: string): Promise<void> {
        const tasks = await this.getAll();
        const filtered = tasks.filter(t => t.id !== taskId);
        await this.storage.set(TASKS_KEY, filtered);
    }

    /**
     * Busca una tarea por su ID.
     * @param id ID de la tarea
     * @returns La tarea si existe, `undefined` si no.
     */
    async getById(id: string): Promise<Task | undefined> {
        const tasks = await this.getAll();
        return tasks.find(t => t.id === id);
    }
}
