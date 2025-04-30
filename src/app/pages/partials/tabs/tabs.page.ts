import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
	selector: 'app-tabs',
	templateUrl: './tabs.page.html',
	styleUrls: ['./tabs.page.scss'],
	standalone: false
})
export class TabsPage {

	currentTab: 'tasks' | 'categories' = 'tasks';

	constructor(private navCtrl: NavController) { }

	selectTab(tab: 'tasks' | 'categories') {
		this.currentTab = tab;
	}

	onDynamicAdd() {
		if (this.currentTab === 'tasks') {
			this.navCtrl.navigateForward('/tasks/new');
		} else if (this.currentTab === 'categories') {
			this.navCtrl.navigateForward('/categories/new');
		}
	}

}
