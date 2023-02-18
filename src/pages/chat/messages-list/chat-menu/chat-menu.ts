import './chat-menu.css';
import { Block } from '../../../../core';
import { withStore, WithStoreProps } from '../../../../hoc';
import { ChatDialogItem } from '../../chats-list/dialog/chat-dialog';

interface ChatMenuProps extends WithStoreProps {
  onAddUserClick: () => void;
  onRemoveUserClick: () => void;
  events: {
    click: () => void;
  }
}

class ChatMenu extends Block<ChatMenuProps> {
  public static override componentName = 'ChatMenu';

  constructor(props: ChatMenuProps) {
    super({
      ...props,
      onAddUserClick: () => {
        // language=hbs
        this.props.store.dispatch({
          dialogContent: `{{{ChatDialog
                              isDelete=false
                              withInput=true
                              item="${ChatDialogItem.USER}"
                          }}}`,
        });
      },
      onRemoveUserClick: () => {
        // language=hbs
        this.props.store.dispatch({
          dialogContent: `{{{ChatDialog
                              isDelete=true
                              withInput=true
                              item="${ChatDialogItem.USER}"
                          }}}`,
        });
      },
      events: {
        click: () => this.props.store.dispatch({ isChatMenuShown: false }),
      },
    });
  }

  private renderAddUserButton() {
    // language=hbs
    return `
        {{{Button
            text="Добавить пользователя"
            className="text-button"
            onClick=onAddUserClick
        }}}
    `;
  }

  private renderRemoveUserButton() {
    // language=hbs
    return `
        {{{Button
            text="Удалить пользователя"
            className="text-button red"
            onClick=onRemoveUserClick
        }}}
    `;
  }

  override render() {
    // language=hbs
    return `
      <div class="chat-menu__layout">
        <div class="chat-menu__container">
            <ol class="chat-menu__list">
                <li>${this.renderAddUserButton()}</li>
                <li>${this.renderRemoveUserButton()}</li>
            </ol>
        </div>
      </div>
    `;
  }
}

export default withStore(ChatMenu);
