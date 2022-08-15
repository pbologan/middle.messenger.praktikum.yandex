import { Block } from '../../core';
import './error.css';

interface ErrorProps {
  text: string;
}
// language=hbs
export default class Error extends Block {
  public static override componentName = 'Error';

  constructor(props: ErrorProps) {
    super({ ...props });
  }

  override render(): string {
    return '<div class="input_error_container red">{{text}}</div>';
  }
}
