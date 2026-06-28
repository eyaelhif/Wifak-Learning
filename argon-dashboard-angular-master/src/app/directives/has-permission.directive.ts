import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {
  private requiredPermissions: string[] = [];
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input()
  set appHasPermission(permission: string | string[]) {
    this.requiredPermissions = Array.isArray(permission) ? permission : [permission];
    this.updateView();
  }

  private updateView(): void {
    const canAccess = this.authService.hasAnyPermission(this.requiredPermissions);

    if (canAccess && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
      return;
    }

    if (!canAccess && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
