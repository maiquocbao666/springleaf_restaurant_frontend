import { Component } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent {

  users: User[] | null = null; 

  constructor(
    private userService: UserService,
  ){
    
  }

  ngOnInit(): void {
    this.userService.gets().subscribe(
      data => {
        this.users = data;
      }
    )
  }

}
