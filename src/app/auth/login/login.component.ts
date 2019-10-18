import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  slackClientId: string = environment.slackClientId;
  redirectUri: string = environment.tokenRedirectUri;

  constructor() {
  }
}
