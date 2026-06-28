import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.acceptTransferredSession()) {
      return true;
    }

    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.authService.redirectToLogin();
    return false;
  }
}
