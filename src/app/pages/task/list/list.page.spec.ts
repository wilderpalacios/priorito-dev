import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListPage } from './list.page';
import { IonicModule } from '@ionic/angular';

describe('ListPage', () => {
	let component: ListPage;
	let fixture: ComponentFixture<ListPage>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ListPage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(ListPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the list page', () => {
		expect(component).toBeTruthy();
	});

	it('should filter tasks correctly', () => {
		component.tasks = [
			{ id: '1', title: 'Task 1', description: '', categoryId: '1', createdAt: new Date(), updatedAt: new Date(), isCompleted: false },
			{ id: '2', title: 'Task 2', description: '', categoryId: '2', createdAt: new Date(), updatedAt: new Date(), isCompleted: true }
		];
		component.filterStatus = 'completed';
		component.applyFilters();
		expect(component.filteredTasks.length).toBe(1);
		expect(component.filteredTasks[0].title).toBe('Task 2');
	});

});
