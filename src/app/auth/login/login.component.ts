import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

const SLACK_SCOPE = 'channels:history,channels:read,groups:history,groups:read,im:read,mpim:read';
const SLACK_OAUTH_URL = (slackClientId: string, redirectUri: string): string =>
  `https://slack.com/oauth/authorize?scope=${SLACK_SCOPE}&client_id=${slackClientId}&redirect_uri=${redirectUri}`;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  oauthUrl: string;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router) {
    this.oauthUrl = SLACK_OAUTH_URL(environment.slackClientId, environment.tokenRedirectUri);
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
