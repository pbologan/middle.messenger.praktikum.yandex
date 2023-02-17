import { Block } from '../../core';
import './error.css';

interface ErrorProps {
  text: string;
}

// language=hbs
export class Error extends Block<ErrorProps> {
  public static override componentName = 'Error';

  override render(): string {
    return '<div class="input_error_container red">{{text}}</div>';
  }
}
