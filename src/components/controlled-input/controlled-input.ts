import './controlled-input.css';
import { Block } from '../../core';
import { InputProps } from '../input/input';
import { validateInput, ValidationRule } from '../../core/validator';

interface ControlledInputProps extends InputProps {
  validationRule: ValidationRule,
}

export default class ControlledInput extends Block {
  public static override componentName = 'ControlledInput';

  constructor({ validationRule, ...props }: ControlledInputProps) {
    super({
      ...props,
      onBlur: (e: FocusEvent) => {
        const { value } = e.target as HTMLInputElement;
        const validationResult = validateInput({
          rule: validationRule,
          value,
        });
        const { error } = this.refs;
        if (error) {
          error.setProps({ text: validationResult });
        }
      },
    });
  }

  override render(): string {
    // language=hbs
    return `
      <div class="controlled-input">
        {{{Input
            id=id
            name=id
            type=type
            placeholder=placeholder
            onBlur=onBlur
            onFocus=onFocus
            onInput=onInput
        }}}
        {{{Error ref="error"}}}
      </div>
    `;
  }
}
