import './chats-list-header.css';
import { Block } from '../../../../core';
import { BrowserRouter } from '../../../../core/router';

interface ChatsListHeaderProps {
  onProfileButtonClick?: () => void;
}

export default class ChatsListHeader extends Block<ChatsListHeaderProps> {
  public static override componentName = 'ChatsListHeader';

  constructor() {
    super({
      onProfileButtonClick: () => {
        BrowserRouter.getInstance().go('/profile');
      },
    });
  }

  override render(): string {
  // language=hbs
    return `
      <div class="flex-column-layout chats__search-layout">
        {{{Button
            text="Профиль"
            className="chats__profile-button"
            onClick=onProfileButtonClick
        }}}
        <input class="chats__search-input" placeholder="Поиск">
      </div>
    `;
  }
}
