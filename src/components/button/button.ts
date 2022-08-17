import './button.css';
import { Block } from '../../core';

interface ButtonProps {
  text: string;
  onClick: () => void;
  className: string;
  events: {
    click: () => void,
  }
}

export default class Button extends Block<ButtonProps> {
  public static override componentName = 'Button';

  constructor({ className, text, onClick } : ButtonProps) {
    super({
      className, text, onClick, events: { click: onClick },
    });
  }

  override render(): string {
    // language=hbs
    return `<button class="{{className}}" type="button">{{text}}</button>`;
  }
}
