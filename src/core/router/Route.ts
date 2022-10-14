import { Block, BlockClass } from '../Block';
import { renderDOM } from '../renderDOM';

export type Props = Record<string, any>;

function isEqual(lhs: string, rhs: string): boolean {
  return lhs === rhs;
}

export class Route <P extends object> {
  private readonly pathname: string;

  private readonly BlockClass: BlockClass<P>;

  private block: Block<any> | null = null;

  private readonly props: Props;

  private readonly isPrefixId: boolean | undefined;

  constructor(pathname: string, view: BlockClass<P>, props: Props) {
    this.isPrefixId = pathname.includes(':id');
    this.pathname = pathname.replace('/:id', '');
    this.BlockClass = view;
    this.props = props;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this.render();
    }
  }

  leave() {
    if (this.block) {
      this.block.hide();
    }
  }

  match(pathname: string) {
    if (this.isPrefixId) {
      pathname = pathname.replace(/\/\d+/, '');
    }
    return isEqual(pathname, this.pathname);
  }

  private prefixHandler() {
    const id = Number(window.location.pathname.replace(/[a-zA-Z/]+/, ''));
    return { id };
  }

  render() {
    const { id } = this.prefixHandler();
    if (!this.block) {
      this.block = new this.BlockClass({ ...this.props, idPath: id } as any);
      renderDOM(this.block);
      return;
    }

    this.block.setProps({ idPath: id });
    this.block.show();
  }
}
