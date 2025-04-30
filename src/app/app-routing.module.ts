import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'tasks', loadChildren: () => import('./pages/task/list/list.module').then(t => t.ListPageModule) },
  { path: 'tasks/new', loadChildren: () => import('./pages/task/form/form.module').then(t => t.FormPageModule) },
  { path: 'tasks/edit/:id', loadChildren: () => import('./pages/task/form/form.module').then(t => t.FormPageModule) },
  { path: 'categories', loadChildren: () => import('./pages/category/list/list.module').then(c => c.ListPageModule) },
  { path: 'categories/new', loadChildren: () => import('./pages/category/form/form.module').then(c=> c.FormPageModule) },
  { path: 'categories/edit/:id', loadChildren: () => import('./pages/category/form/form.module').then(c => c.FormPageModule) },
  { path: '', loadChildren: () => import('./pages/partials/tabs/tabs.module').then( t => t.TabsPageModule)},
  { path: '**', redirectTo: '', pathMatch: 'full' },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
