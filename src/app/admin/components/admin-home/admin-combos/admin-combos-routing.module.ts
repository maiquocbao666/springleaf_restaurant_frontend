import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCombosComponent } from './admin-combos.component';

const routes: Routes = [
  
    {
      path: '',
      component: AdminCombosComponent
    }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminCombosRoutingModule { }
