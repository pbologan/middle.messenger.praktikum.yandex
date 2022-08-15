import './input.css';
import { Block } from '../../core';

export interface InputProps {
  id?: string;
  type?: 'text' | 'password' | 'email';
  placeholder?: string;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onInput?: (e: InputEvent) => void;
  ref?: Block;
}

export default class Input extends Block {
  public static override componentName = 'Input';

  constructor({
    onFocus, onBlur, onInput, ...props
  } : InputProps) {
    super({
      ...props,
      events: {
        input: onInput,
        blur: onBlur,
        focus: onFocus,
      },
    });
  }

  // language=hbs
  override render(): string {
    return `<input class="input" type="{{type}}" placeholder="{{placeholder}}" name="{{id}}" id="{{id}}">`;
  }
}
