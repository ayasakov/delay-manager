import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable()
export class AuthGuard implements CanActivateChild {
  constructor(private router: Router,
              private auth: AuthService) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.getUserInfo().pipe(
      map(() => true),
      catchError(() => of(false)),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.auth.interruptedUrl = state.url;
          this.router.navigate(['/auth', 'login']);
        }
      })
    );
  }
}
