import './input.css';
import { Block } from '../../core';

export interface InputProps {
  value?: string;
  className: string;
  id?: string;
  type?: 'text' | 'password' | 'email';
  placeholder?: string;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onInput?: (e: InputEvent) => void;
  ref?: Block<object>;
  events: {
    input?: ((e: InputEvent) => void) | undefined,
    blur?: ((e: FocusEvent) => void) | undefined,
    focus?: ((e: FocusEvent) => void) | undefined,
  }
}

export default class Input extends Block<InputProps> {
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
    return `<input class="{{className}}" type="{{type}}" placeholder="{{placeholder}}" name="{{id}}" id="{{id}}" value="{{value}}">`;
  }
}
