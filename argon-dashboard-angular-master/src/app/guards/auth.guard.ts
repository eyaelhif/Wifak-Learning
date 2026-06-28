import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    return this.checkAuthenticated();
  }

  canActivateChild(): boolean | UrlTree {
    return this.checkAuthenticated();
  }

  private checkAuthenticated(): boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/login']);
    }

    if (!this.authService.hasBackofficeAccess()) {
      window.location.href = this.authService.buildFrontofficeSessionUrl();
      return false;
    }

    return true;
  }
}
