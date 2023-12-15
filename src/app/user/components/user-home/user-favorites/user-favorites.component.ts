import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Favorite } from 'src/app/interfaces/favorite';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-user-favorites',
  templateUrl: './user-favorites.component.html',
  styleUrls: ['./user-favorites.component.css']
})
export class UserFavoritesComponent {
  favorites$!: Observable<Favorite[]>;
  favorite!: Favorite[];
  favorites: Favorite[] = [];
  user: User | null = null;
  favoritesUrl = 'favorites';

  constructor(
    private favoriteService: FavoriteService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private toastService: ToastService,
  ) {
    this.authService.getUserCache().subscribe((data) => {
      this.user = data;
    });
    
  }

  ngOnInit(): void {
    this.getFavorites();
  }

  getFavorites(): void {
    this.favoriteService.getCache().subscribe(
      cached => {
        this.favorites = this.favorites;
      }
    );
  }
}
