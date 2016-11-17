import { ParrotPage } from './app.po';

describe('parrot App', function() {
  let page: ParrotPage;

  beforeEach(() => {
    page = new ParrotPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
