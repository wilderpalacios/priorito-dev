import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
	{
		path: 'tabs',
		component: TabsPage,
		children: [
			{
				path: 'tasks',
				loadChildren: () => import('../../task/list/list.module').then(m => m.ListPageModule)
			},
			{
				path: 'categories',
				loadChildren: () => import('../../category/list/list.module').then(m => m.ListPageModule)
			},
			{
				path: '',
				redirectTo: '/tabs/tasks',
				pathMatch: 'full'
			}
		]
	},
	{
		path: '',
		redirectTo: '/tabs/tasks',
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class TabsPageRoutingModule { }
