import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserEventsComponent } from './user-events.component';

const routes: Routes = [
  {
    path: '',
    component: UserEventsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserEventRoutingModule { }
