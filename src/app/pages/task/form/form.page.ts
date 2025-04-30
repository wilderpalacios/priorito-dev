import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TaskService } from 'src/app/services/task.service';
import { CategoryService } from 'src/app/services/category.service';
import { EventBusService } from 'src/app/services/event-bus.service';
import { ToastService } from 'src/app/services/toast.service';

import { Category } from 'src/app/models/category.model';
import { LoadingController } from '@ionic/angular';


@Component({
	selector: 'app-form',
	templateUrl: './form.page.html',
	styleUrls: ['./form.page.scss'],
	standalone: false,
})
export class FormPage implements OnInit {

	taskForm!: FormGroup;

	categories: Category[] = [];

	isEditMode = false;

	taskId!: string;

	selectedCategoryId: string = '';

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private taskService: TaskService,
		private toastService: ToastService,
		private eventBus: EventBusService,
		private loadingCtrl: LoadingController,
		private categoryService: CategoryService
	) { }

	/**
	 * Inicializa el formulario y determina si es modo edición.
	 */
	ngOnInit(): void {
		this.initForm();
		this.loadCategories();

		this.taskId = this.route.snapshot.paramMap.get('id') || '';
		if (this.taskId) {
			this.isEditMode = true;
			this.loadTask();
		}

		this.taskForm.get('categoryId')?.valueChanges.subscribe(val => {
			this.selectedCategoryId = val;
		});
	}

	/**
	 * Inicializa el formulario reactivo con validadores.
	 */
	initForm(): void {
		this.taskForm = this.fb.group({
			title: ['', Validators.required],
			description: [''],
			categoryId: ['', Validators.required],
			isCompleted: [false]
		});
	}

	/**
	 * Carga todas las categorías para el select.
	 */
	async loadCategories(): Promise<void> {
		this.categories = await this.categoryService.getAll();
	}

	/**
	 * Si es modo edición, carga la tarea para llenar el formulario.
	 */
	async loadTask(): Promise<void> {
		const task = await this.taskService.getById(this.taskId);
		if (task) {
			this.taskForm.patchValue(task);
			this.selectedCategoryId = task.categoryId;
		}
	}

	/**
	 * Envía los datos del formulario.
	 * Si es edición, actualiza. Si no, crea una nueva tarea.
	 */
	async onSubmit(): Promise<void> {
		if (this.taskForm.invalid) return;

		const loading = await this.loadingCtrl.create({
			message: this.isEditMode ? 'Actualizando...' : 'Creando...',
		});
		await loading.present();

		const formData = this.taskForm.value;

		if (this.isEditMode) {
			await this.taskService.update({
				...formData,
				id: this.taskId,
				updatedAt: new Date()
			});
		} else {
			await this.taskService.add(formData);
		}
		await loading.dismiss();
		
		this.toastService.show(`Tarea ${this.isEditMode ? 'actualizada' : 'creada'} exitosamente.`);
		this.eventBus.emit({ type: 'task:created' });

		// Navega correctamente dentro del módulo tabs
		this.router.navigateByUrl('/tabs/tasks');
	}

	/**
	 * Cambia la categoría seleccionada desde la UI (chips o botones personalizados).
	 * @param categoryId ID de la categoría seleccionada
	 */
	selectCategory(categoryId: string): void {
		this.taskForm.get('categoryId')?.setValue(categoryId);
	}
}
