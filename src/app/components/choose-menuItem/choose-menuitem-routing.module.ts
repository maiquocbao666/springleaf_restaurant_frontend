import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseMenuItemComponent } from './choose-menuitem.component';

const routes: Routes = [
  {
    path: '',
    component: ChooseMenuItemComponent,
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChooseMenuItemRoutingModule { }
