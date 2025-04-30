import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import { Subscription } from 'rxjs';
import { EventBusService } from 'src/app/services/event-bus.service';

@Component({
	selector: 'app-category-list',
	templateUrl: './list.page.html',
	styleUrls: ['./list.page.scss'],
	standalone: false
})
export class ListPage implements OnInit, OnDestroy {
	categories: Category[] = [];
	private subscriptions = new Subscription();

	constructor(
		private categoryService: CategoryService,
		private alertController: AlertController,
		private router: Router,
		private eventBus: EventBusService
	) { }

	/**
	 * Inicializa los datos de la vista y suscripciones
	 */
	async ngOnInit() {
		await this.loadCategories();

		this.subscriptions.add(
			this.eventBus.events$.subscribe(event => {
				if (event.type === 'category:created') {
					this.loadCategories();
				}
			})
		);
	}

	/**
	 * Limpia subscripciones al destruir componente
	 */
	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	/**
	 * Carga todas las categorías desde el servicio
	 */
	private async loadCategories() {
		this.categories = await this.categoryService.getAll();
	}

	/**
	 * Elimina una categoría con confirmación
	 * @param categoryId ID de la categoría a eliminar
	 */
	async deleteCategory(categoryId: string) {
		const alert = await this.alertController.create({
			header: '¿Eliminar categoría?',
			message: 'Esta acción no se puede deshacer.',
			mode: 'ios',
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel'
				},
				{
					text: 'Eliminar',
					handler: async () => {
						await this.categoryService.delete(categoryId);
						this.loadCategories();
					}
				}
			]
		});

		await alert.present();
	}

	/**
	 * Permite a Angular optimizar renderizado por ID
	 */
	trackByCategoryId(index: number, category: Category): string {
		return category.id;
	}

	/**
	 * Navega al formulario de edición
	 * @param id ID de la categoría
	 */
	goToEdit(id: string) {
		this.router.navigate(['/categories/edit', id]);
	}
}
