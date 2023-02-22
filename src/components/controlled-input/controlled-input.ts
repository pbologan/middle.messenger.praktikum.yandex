import './controlled-input.css';
import { Block } from '../../core';
import { InputProps } from '../input/input';
import { validateInput, ValidationRule } from '../../core/validator';

interface ControlledInputProps extends InputProps {
  fullWidth?: boolean;
  validationRule: ValidationRule;
}

export class ControlledInput extends Block<ControlledInputProps> {
  public static override componentName = 'ControlledInput';

  constructor({ validationRule, ...props }: ControlledInputProps) {
    super({
      ...props,
      validationRule,
      onBlur: (e: FocusEvent) => {
        const { value } = e.target as HTMLInputElement;
        const validationResult = validateInput({
          rule: validationRule,
          value,
        });
        const { error } = this.refs;
        error?.setProps({ text: validationResult });
      },
      onFocus: () => {
        const { error } = this.refs;
        if (error) {
          error.setProps({ text: '' });
        }
      },
    });
  }

  override render(): string {
    const containerClass = this.props.fullWidth
      ? "controlled-input__full-width"
      : "controlled-input";

    // language=hbs
    return `
      <div class=${containerClass}>
        {{{Input
            value=value
            className=className
            id=id
            name=id
            type=type
            ref="input"
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
