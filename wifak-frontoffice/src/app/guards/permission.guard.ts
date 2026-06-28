import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    // ex: data: { permission: 'QUIZ_CREATE' }
    const required: string = route.data['permission'];

    if (!required) return true;

    if (this.authService.hasPermission(required)) return true;

    return this.router.createUrlTree(['/access-denied']);
  }
}