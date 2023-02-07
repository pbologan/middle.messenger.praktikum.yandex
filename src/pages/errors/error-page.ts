import './error-page.css';
import { Block } from '../../core';
import { BrowserRouter } from '../../core/router';

interface ErrorPageProps {
  code: string;
  description: string;
  onBackButtonClick?: () => void;
}

export default class ErrorPage extends Block<ErrorPageProps> {
  public static override componentName = 'ErrorPage';

  constructor({ code, description }: ErrorPageProps) {
    super({
      code,
      description,
      onBackButtonClick: () => {
        BrowserRouter.getInstance().back();
      },
    });
  }

  override render(): string {
    // language=hbs
    return `
      <main class="errors-layout">
        <h1 class="errors-title">{{code}}</h1>
        <p class="errors-description">{{description}}</p>
        {{{Button
            text="Назад"
            onClick=onBackButtonClick
            className="borderless-button blue cursor-pointer"
        }}}
      </main>
    `;
  }
}
