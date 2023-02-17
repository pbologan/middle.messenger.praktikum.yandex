import './input.css';
import { Block } from '../../core';

export interface InputProps {
  value?: string;
  className: string;
  id?: string;
  type?: 'text' | 'password' | 'email' | 'file';
  placeholder?: string;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onChange?: (e?: Event) => void;
  onInput?: (e: InputEvent) => void;
  ref?: Block<object>;
  accept?: string,
  events: {
    input?: ((e: InputEvent) => void) | undefined,
    blur?: ((e: FocusEvent) => void) | undefined,
    focus?: ((e: FocusEvent) => void) | undefined,
    change?: ((e?: Event) => void) | undefined,
  }
}

export class Input extends Block<InputProps> {
  public static override componentName = 'Input';

  constructor({
    onFocus, onBlur, onInput, onChange, ...props
  } : InputProps) {
    super({
      ...props,
      events: {
        input: onInput,
        blur: onBlur,
        focus: onFocus,
        change: onChange,
      },
    });
  }

  // language=hbs
  override render(): string {
    return `<input 
              class="{{className}}"
              type="{{type}}"
              placeholder="{{placeholder}}"
              name="{{id}}" id="{{id}}"
              value="{{value}}"
              onchange="{{onChange}}"
              accept="{{accept}}">`;
  }
}
