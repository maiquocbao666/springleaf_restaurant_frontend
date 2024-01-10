import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillInfoComponent } from './bill-info.component';

const routes: Routes = [
  {
    path: '',
    component: BillInfoComponent,
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillInfoRoutingModule { }
