import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { CategoryService } from 'src/app/services/category.service';
import { FirebaseRemoteConfigService } from 'src/app/services/firebase-remote-config.service';
import { EventBusService } from 'src/app/services/event-bus.service';
import { ToastService } from 'src/app/services/toast.service';
import { TimerService } from 'src/app/services/timer.service';

import { Task } from 'src/app/models/task.model';
import { Category } from 'src/app/models/category.model';

import { Subscription } from 'rxjs';
import { formatTime } from 'src/app/utils/time.util';

@Component({
	selector: 'app-list',
	templateUrl: './list.page.html',
	styleUrls: ['./list.page.scss'],
	standalone: false,
})
export class ListPage implements OnInit, OnDestroy {
	tasks: Task[] = [];

	filteredTasks: Task[] = [];

	categories: Category[] = [];

	filterStatus: string = 'all';

	filterCategoryId: string = '';

	enableTaskTimer = false;

	private subscriptions = new Subscription();

	constructor(
		private taskService: TaskService,
		private categoryService: CategoryService,
		private remoteConfigService: FirebaseRemoteConfigService,
		private eventBus: EventBusService,
		private toastService: ToastService,
		public timerService: TimerService
	) { }

	/**
	 * Inicializa los datos de la vista: escucha eventos, carga RemoteConfig y datos de tareas y categorías.
	 * 
	 */
	async ngOnInit(): Promise<void> {
		this.subscriptions.add(
			this.eventBus.events$.subscribe(event => {
				if (event.type === 'task:created') {
					this.loadData();
				}
			})
		);

		await this.remoteConfigService.initRemoteConfig();
		this.enableTaskTimer = await this.remoteConfigService.getBooleanFlag('enable_task_timer');

		await this.loadData();
	}

	/**
	 * Limpia las suscripciones al destruir el componente.
	 */
	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	/**
	 * Carga la lista de tareas y categorías desde los servicios y aplica filtros actuales.
	 */
	private async loadData(): Promise<void> {
		[this.tasks, this.categories] = await Promise.all([
			this.taskService.getAll(),
			this.categoryService.getAll(),
		]);
		this.applyFilters();
	}

	/**
	 * Aplica los filtros activos sobre la lista de tareas.
	 */
	applyFilters(): void {
		this.filteredTasks = this.tasks.filter(task =>
			(this.filterStatus === 'all' || (this.filterStatus === 'completed') === task.isCompleted) &&
			(!this.filterCategoryId || task.categoryId === this.filterCategoryId)
		);
	}

	/**
	 * Cambia el estado completado de una tarea y la actualiza.
	 * @param task Tarea que se desea modificar
	 */
	async toggleComplete(task: Task): Promise<void> {
		task.isCompleted = !task.isCompleted;
		await this.taskService.update(task);
		this.applyFilters();
	}

	/**
	 * Elimina una tarea por su ID.
	 * @param taskId ID de la tarea
	 */
	async deleteTask(taskId: string): Promise<void> {
		await this.taskService.delete(taskId);
		await this.loadData();
	}

	/**
	 * Obtiene el nombre de la categoría asociada a un ID.
	 * @param categoryId ID de la categoría
	 * @returns Nombre de la categoría o 'Sin categoría'
	 */
	getCategoryName(categoryId: string): string {
		return this.categories.find(c => c.id === categoryId)?.name ?? 'Sin categoría';
	}

	/**
	 * Obtiene el color HEX de una categoría dado su ID.
	 * @param categoryId ID de la categoría
	 * @returns Color HEX o blanco por defecto
	 */
	getCategoryColor(categoryId: string): string {
		return this.categories.find(c => c.id === categoryId)?.color ?? '#FFF';
	}

	/**
	 * Inicia el temporizador para una tarea.
	 * @param taskId ID de la tarea
	 */
	startTimer(taskId: string): void {
		this.timerService.start(taskId);
	}

	/**
	 * Detiene el temporizador, acumula el tiempo en la tarea y muestra un toast.
	 * @param taskId ID de la tarea
	 */
	stopTimer(taskId: string): void {
		const elapsed = this.timerService.stop(taskId);
		const task = this.tasks.find(t => t.id === taskId);
		if (task) {
			task.timeSpentInSeconds = (task.timeSpentInSeconds || 0) + elapsed;
			this.taskService.update(task);
			this.toastService.show(`⏱️ Total tiempo registrado: ${formatTime(task.timeSpentInSeconds)}`);
		}
	}

	/**
	 * Calcula el tiempo total combinado entre tiempo guardado y tiempo activo (en ejecución).
	 * @param taskId ID de la tarea
	 * @param baseTime Tiempo ya almacenado (en segundos)
	 * @returns Tiempo formateado en mm:ss
	 */
	formatElapsed(taskId: string, baseTime: number = 0): string {
		const live = this.timerService.getElapsed(taskId);
		return formatTime(baseTime + live);
	}

	/**
	 * Función trackBy para mejorar el rendimiento del *ngFor.
	 * @param _ Index
	 * @param task Tarea actual
	 * @returns ID de la tarea
	 */
	trackByTaskId = (_: number, task: Task) => task.id;
}
