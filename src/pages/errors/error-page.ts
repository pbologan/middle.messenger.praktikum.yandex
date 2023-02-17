import './styles.css';
import { Block, BrowserRouter } from '../../core';

interface ErrorPageProps {
  code: string;
  description: string;
  onBackButtonClick?: () => void;
}

export class ErrorPage extends Block<ErrorPageProps> {
  public static override componentName = 'ErrorPage';

  constructor() {
    super({
      code: '500',
      description: 'Что-то пошло не так, уже разбираемся...',
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
            className="text-button"
        }}}
      </main>
    `;
  }
}
