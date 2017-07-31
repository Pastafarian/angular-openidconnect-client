import { Injectable } from '@angular/core';

@Injectable()
export class OpenIdConfiguration {
  authorization_endpoint: string;
  token_endpoint: string;
}
