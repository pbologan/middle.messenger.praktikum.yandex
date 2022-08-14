import './button.css';
import { Block } from '../../core';

interface ButtonProps {
  text: string;
  onClick: () => void;
  className: string;
}

// language=hbs
export default class Button extends Block {
  public static componentName = 'Button';

  constructor({ className, text, onClick }: ButtonProps) {
    super({ className, text, events: { click: onClick } });
  }

  // eslint-disable-next-line class-methods-use-this
  render(): string {
    // eslint-disable-next-line @typescript-eslint/quotes
    return `<button class="{{className}}" type="button">{{text}}</button>`;
  }
}
