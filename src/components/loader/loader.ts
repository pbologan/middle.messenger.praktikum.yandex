import "./loader.css";
import { Block } from '../../core';

interface LoaderProps {}

export class Loader extends Block<LoaderProps> {
  public static override componentName = 'Loader';

  override render(): string {
    // language=hbs
    return `
        <div class="loader-container">
            <span class="loader-content">Загрузка...</span>
        </div>
    `;
  }
}
