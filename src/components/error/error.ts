import { Block } from '../../core';
import './error.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ErrorProps {
  text: string;
}
// language=hbs
export default class Error extends Block {
  public static componentName = 'Error';

  // eslint-disable-next-line class-methods-use-this
  render(): string {
    return '<div class="input_error_container red">{{text}}</div>';
  }
}
