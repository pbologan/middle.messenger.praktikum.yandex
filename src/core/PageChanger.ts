import { renderDOM } from './index';
import Block from './Block';
import { Link } from '../utils/routing/routing';

export default class PageChanger {
  private pages: Record<Link, Block<any>> = {} as Record<Link, Block<any>>;

  constructor(startLink: Link, page: Block<any>) {
    this.pages[startLink] = page;
    this.renderPage(startLink);
  }

  private renderPage(link: Link) {
    const page = this.pages[link];
    if (page) {
      renderDOM(page);
    }
  }

  public addPage(link: Link, page: Block<any>) {
    this.pages[link] = page;
  }

  onLinkChanged(link: Link): void {
    this.renderPage(link);
  }
}
