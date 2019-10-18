import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  slackClientId: string = environment.slackClientId;
  redirectUri: string = environment.tokenRedirectUri;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    const query$ = this.route.queryParams
      .pipe(filter((params: { code?: string, error?: string }) => params && (!!params.code || !!params.error)))
      .subscribe((params: { code: string }) => {
        this.authService.login(params).subscribe(
          () => this.router.navigate(['/home']),
          (error) => {
            this.router.navigate(['/auth/login']);
            console.log('Err:', error);
          }
        );
      });

    this.subscription.add(query$);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
