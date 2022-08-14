import { nanoid } from 'nanoid';
import Handlebars from 'handlebars';
import EventBus from './EventBus';

type Events = Values<typeof Block.EVENTS>;

export default class Block<P = any> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  } as const;

  public id = nanoid(6);

  public static componentName: string;

  protected element: Nullable<HTMLElement> = null;

  protected readonly props: P;

  protected children: { [id : string]: Block } = {};

  eventBus: () => EventBus<Events>;

  protected state: any = {};

  public refs: { [key : string]: Block } = {};

  public constructor(props?: P) {
    const eventBus = new EventBus<Events>();
    this.getStateFromProps(props);
    this.props = this.makePropsProxy(props || {} as P);
    this.state = this.makePropsProxy(this.state);
    this.eventBus = () => eventBus;
    this.registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT, this.props);
  }

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  protected getStateFromProps(props: any): void { }

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  protected componentDidMount(props: P): void { }

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  protected componentDidUpdate(oldProps: P, newProps: P): boolean {
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  protected render(): string {
    return '';
  }

  private registerEvents(eventBus: EventBus<Events>) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this.didMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this.didUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this.innerRender.bind(this));
  }

  init() {
    this.element = document.createElement('div');
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER, this.props);
  }

  private didMount(props: P) {
    this.componentDidMount(props);
  }

  private didUpdate(oldProps: P, newProps: P) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this.innerRender();
  }

  public setProps = (nextProps: P) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  protected setState = (nextState: any) => {
    if (!nextState) {
      return;
    }

    Object.assign(this.state, nextState);
  };

  private innerRender() {
    const fragment = this.compile();

    this.removeEvents();
    const newElement = fragment.firstElementChild!;

    this.element!.replaceWith(newElement);

    this.element = newElement as HTMLElement;
    this.addEvents();
  }

  getContent(): HTMLElement {
    if (this.element?.parentNode?.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      setTimeout(() => {
        if (this.element?.parentNode?.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
          this.eventBus().emit(Block.EVENTS.FLOW_CDM);
        }
      }, 100);
    }

    return this.element!;
  }

  private makePropsProxy(props: any): any {
    const self = this;

    return new Proxy(props as unknown as object, {
      get(target: Record<string, unknown>, prop: string) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target: Record<string, unknown>, prop: string, value: unknown) {
        // eslint-disable-next-line no-param-reassign
        target[prop] = value;

        self.eventBus().emit(Block.EVENTS.FLOW_CDU, { ...target }, target);
        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    }) as unknown as P;
  }

  private removeEvents() {
    // eslint-disable-next-line prefer-destructuring
    const events: Record<string, () => void> = (this.props as any).events;

    if (!events || !this.element) {
      return;
    }

    Object.entries(events).forEach(([event, listener]) => {
      this.element!.removeEventListener(event, listener);
    });
  }

  private addEvents() {
    // eslint-disable-next-line prefer-destructuring
    const events: Record<string, () => void> = (this.props as any).events;

    if (!events) {
      return;
    }

    Object.entries(events).forEach(([event, listener]) => {
      this.element!.addEventListener(event, listener);
    });
  }

  private compile(): DocumentFragment {
    const fragment = document.createElement('template');

    const template = Handlebars.compile(this.render());
    fragment.innerHTML = template({
      ...this.state, ...this.props, children: this.children, refs: this.refs,
    });

    Object.entries(this.children).forEach(([id, component]) => {
      const stub = fragment.content.querySelector(`[data-id="${id}"]`);

      if (!stub) {
        return;
      }

      const content = component.getContent();
      stub.replaceWith(content);
    });

    return fragment.content;
  }

  show() {
    this.getContent().style.display = 'block';
  }

  hide() {
    this.getContent().style.display = 'none';
  }
}
