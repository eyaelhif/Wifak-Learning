import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class ProfilGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const allowedProfils = ((route.data['profils'] || []) as string[])
      .map(profil => profil.toUpperCase());

    if (allowedProfils.length === 0) {
      return true;
    }

    const userProfils = (this.authService.getCurrentUser()?.profils || [])
      .map(profil => profil.toUpperCase());
    const hasAccess = allowedProfils.some(profil => userProfils.includes(profil));

    if (hasAccess) {
      return true;
    }

    return this.router.createUrlTree(['/access-denied']);
  }
}
