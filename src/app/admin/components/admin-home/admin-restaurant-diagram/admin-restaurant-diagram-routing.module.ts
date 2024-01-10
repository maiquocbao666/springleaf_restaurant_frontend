import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminRestaurantDiagramComponent } from './admin-restaurant-diagram.component';

const routes: Routes = [
  {
    path: '',
    component: AdminRestaurantDiagramComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRestaurantDiagramRoutingModule { }
