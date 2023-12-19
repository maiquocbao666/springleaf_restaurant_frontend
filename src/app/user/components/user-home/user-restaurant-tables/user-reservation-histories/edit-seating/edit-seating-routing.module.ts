import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditSeatingComponent } from './edit-seating.component';

const routes: Routes = [
  {
    path: '',
    component: EditSeatingComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditSeatingRoutingModule { }
