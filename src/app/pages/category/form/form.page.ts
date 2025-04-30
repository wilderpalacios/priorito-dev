import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import { LoadingController } from '@ionic/angular';
import { EventBusService } from 'src/app/services/event-bus.service';
import { generateRandomColors } from 'src/app/utils/color.util';
import { ToastService } from 'src/app/services/toast.service';

@Component({
	selector: 'app-form',
	templateUrl: './form.page.html',
	styleUrls: ['./form.page.scss'],
	standalone: false,
})
export class FormPage implements OnInit {
	categoryForm!: FormGroup;
	isEditMode = false;
	categoryId!: string;

	colorOptions: string[] = [];

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private toastService: ToastService,
		private categoryService: CategoryService,
		private loadingCtrl: LoadingController,
		private eventBus: EventBusService
	) { }

	/**
	 * Inicializa formulario y carga datos si es modo edición
	 */
	ngOnInit(): void {
		this.colorOptions = generateRandomColors(10);
		this.initForm();

		this.route.paramMap.subscribe(async (params) => {
			const id = params.get('id');
			if (id) {
				this.isEditMode = true;
				this.categoryId = id;

				const category = await this.categoryService.getById(id);
				if (category) {
					this.categoryForm.patchValue(category);

					const currentColor = category.color;
					if (currentColor && !this.colorOptions.includes(currentColor)) {
						this.colorOptions[0] = currentColor;
					}
				}
			}
		});
	}

	/**
	 * Configura el formulario reactivo
	 */
	private initForm(): void {
		this.categoryForm = this.fb.group({
			name: ['', [Validators.required, Validators.minLength(3)]],
			color: ['#58c091', Validators.required],
		});
	}

	/**
	 * Maneja el envío del formulario: creación o edición
	 */
	async onSubmit(): Promise<void> {
		if (this.categoryForm.invalid) return;

		const loading = await this.loadingCtrl.create({
			message: this.isEditMode ? 'Actualizando...' : 'Creando...',
		});
		await loading.present();

		const data: Category = {
			...this.categoryForm.value,
			id: this.categoryId || new Date().getTime().toString(),
			createdAt: this.isEditMode ? undefined : new Date().toISOString(),
		};

		if (this.isEditMode) {
			await this.categoryService.update(data);
		} else {
			await this.categoryService.add(data);
		}

		await loading.dismiss();

		this.toastService.show(`Categoría ${this.isEditMode ? 'actualizada' : 'creada'} exitosamente.`);

		this.eventBus.emit({ type: 'category:created' });
		this.router.navigate(['/tabs/categories']);
	}

	/**
	 * Shortcut getter para el control 'name'
	 */
	get name() {
		return this.categoryForm.get('name');
	}

	/**
	 * Shortcut getter para el control 'color'
	 */
	get color() {
		return this.categoryForm.get('color');
	}

	/**
	 * Asigna el color desde selección externa (ej: chip o botón)
	 * @param color Color hexadecimal seleccionado
	 */
	selectColor(color: string): void {
		this.categoryForm.get('color')?.setValue(color);
	}
}
