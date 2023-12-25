import { RouterModule, Routes } from "@angular/router";
import { LocationRestaurantComponent } from "./location-restaurant.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
      path: '',
      component: LocationRestaurantComponent,
      
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class LocationRestaurantRoutingModule { }
  