import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';


@Injectable()
export class UnAuthGuard implements CanActivateChild {
  constructor(private router: Router,
              private auth: AuthService) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.getLoginStatus().pipe(
      tap((isAuthenticate) => {
        if (isAuthenticate) {
          this.router.navigate(['/home']);
        }
      }),
      map((isAuthenticated) => !isAuthenticated)
    );
  }
}
