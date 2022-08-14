import './controlled-input.css';
import { Block } from '../../core';
import { InputProps } from '../input/input';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ControlledInputProps extends InputProps { }

// language=hbs
export default class ControlledInput extends Block {
  public static componentName = 'ControlledInput';

  // eslint-disable-next-line class-methods-use-this
  render(): string {
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
