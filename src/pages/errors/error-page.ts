import "./error-page.css";
import { Block } from '../../core';

interface ErrorPageProps {
  code: string;
  description: string;
  backLink: string;
}

export default class ErrorPage extends Block<ErrorPageProps> {
  public static override componentName = 'ErrorPage';

  override render(): string {
    // language-hbs
    return `
      <main class="errors-layout">
        <h1 class="errors-title">{{code}}</h1>
        <p class="errors-description">{{description}}</p>
        <a class="errors-back-link" href="${this.props.backLink}">Назад</a>
      </main>
    `;
  }
}
