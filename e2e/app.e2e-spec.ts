import { AngularOpenidconnectClientPage } from './app.po';

describe('angular-openidconnect-client App', () => {
  let page: AngularOpenidconnectClientPage;

  beforeEach(() => {
    page = new AngularOpenidconnectClientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
