import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormPage } from './form.page';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

describe('FormPage', () => {
	let component: FormPage;
	let fixture: ComponentFixture<FormPage>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FormPage],
			imports: [IonicModule.forRoot(), ReactiveFormsModule]
		}).compileComponents();

		fixture = TestBed.createComponent(FormPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the form page', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize form', () => {
		expect(component.taskForm).toBeDefined();
	});

});
