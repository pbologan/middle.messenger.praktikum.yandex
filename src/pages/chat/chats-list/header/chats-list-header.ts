import './chats-list-header.css';
import { Block } from '../../../../core';
import { Link, pushPage } from '../../../../utils/routing/routing';

interface ChatsListHeaderProps {
  onProfileButtonClick?: () => void;
}

export default class ChatsListHeader extends Block<ChatsListHeaderProps> {
  public static override componentName = 'ChatsListHeader';

  constructor() {
    super({
      onProfileButtonClick: () => {
        pushPage(Link.PROFILE);
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
