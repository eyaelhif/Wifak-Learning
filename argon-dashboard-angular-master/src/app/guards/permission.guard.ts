import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const permissions = route.data['permissions'] as string[] | undefined;

    if (this.authService.hasAnyPermission(permissions || [])) {
      return true;
    }

    return this.router.createUrlTree(['/dashboard']);
  }
}
