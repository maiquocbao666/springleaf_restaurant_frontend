import { Component } from '@angular/core';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-user-footer',
  templateUrl: './user-footer.component.html',
  styleUrls: ['./user-footer.component.css']
})
export class UserFooterComponent {

  restaurants: Restaurant[] = [];
  userCache : User | null = null;

  constructor(
    private authService: AuthenticationService,
  ) {
    const storedRestaurants = localStorage.getItem('restaurants');
    if(storedRestaurants){
      this.restaurants = JSON.parse(storedRestaurants) as Restaurant[];
    }

    this.authService.getUserCache().subscribe((data) => {
      this.userCache = data;
    });
    
  }

  ngOnInit(): void {
    console.log('footer' + this.restaurants)
  }
}
