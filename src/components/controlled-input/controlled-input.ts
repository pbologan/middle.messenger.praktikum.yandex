import './controlled-input.css';
import { Block } from '../../core';
import { InputProps } from '../input/input';
import { validateInput, ValidationRule } from '../../core/validator';

interface ControlledInputProps extends InputProps {
  validationRule: ValidationRule,
}

export default class ControlledInput extends Block {
  public static componentName = 'ControlledInput';

  constructor({ validationRule, ...props }: ControlledInputProps) {
    super({
      ...props,
      onBlur: (e: FocusEvent) => {
        const { value } = e.target as HTMLInputElement;
        const validationResult = validateInput({
          rule: validationRule,
          value,
        });
        this.refs.error.setProps({ text: validationResult });
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  render(): string {
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
