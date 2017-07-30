// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  authority: "http://localhost:44362",
  client_id: "js",
  redirect_uri: "http://localhost:4200/auth.html",
  response_type: "id_token token",
  scope: "openid profile api1",
  post_logout_redirect_uri: "http://localhost:4200/index.html",
  silent_redirect_uri: 'http://localhost:4200/silent-renew.html',
  automaticSilentRenew: true,
  filterProtocolClaims: true,
  loadUserInfo: true,
  testApiUrl:'http://localhost:5001/'
};
