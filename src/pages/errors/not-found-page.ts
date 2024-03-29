import './styles.css';
import { Block, BrowserRouter } from '../../core';

interface NotFoundPageProps {
  code: string;
  description: string;
  onBackButtonClick?: () => void;
}

export class NotFoundPage extends Block<NotFoundPageProps> {
  public static override componentName = 'NotFoundPage';

  constructor() {
    super({
      code: '404',
      description: 'Страница не существует',
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
