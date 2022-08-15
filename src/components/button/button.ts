import './button.css';
import { Block } from '../../core';

interface ButtonProps {
  text: string;
  onClick: () => void;
  className: string;
}

export default class Button extends Block {
  public static override componentName = 'Button';

  constructor({ className, text, onClick }: ButtonProps) {
    super({ className, text, events: { click: onClick } });
  }

  override render(): string {
    // language=hbs
    return `<button class="{{className}}" type="button">{{text}}</button>`;
  }
}
