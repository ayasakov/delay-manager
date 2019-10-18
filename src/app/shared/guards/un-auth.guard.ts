import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';


@Injectable()
export class UnAuthGuard implements CanActivateChild {
  constructor(private router: Router,
              private auth: AuthService) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
    return !this.auth.isAuthenticated();
  }
}
