import './messages-header.css';
import { Block } from '../../../../core';
import { Link, pushPage } from '../../../../utils/routing/routing';

interface MessagesHeaderProps {
  onOptionsButtonClick?: () => void;
}

export default class MessagesHeader extends Block<MessagesHeaderProps> {
  public static override componentName = 'MessagesHeader';

  constructor() {
    super({
      onOptionsButtonClick: () => {
        pushPage(Link.ERROR_404);
      },
    });
  }

  override render(): string {
    // language=hbs
    return `
      <div class="flex-row-layout messages__chat-name-layout">
        <div class="messages__avatar-stub"></div>
        <span class="messages__username">Павел</span>
        {{{Button
            className="messages__chat-options-button"
            onClick=onOptionsButtonClick
        }}}
      </div>
    `;
  }
}
