import './chats-list-header.css';
import { Block, BrowserRouter } from '../../../../core';
import { Page } from '../../../../models/app';
import { withStore, WithStoreProps } from '../../../../hoc';
import { ChatDialogItem } from '../dialog/chat-dialog';

interface ChatsListHeaderProps extends WithStoreProps {
  onProfileButtonClick: () => void;
  onAddChatButtonClick: () => void;
  onDeleteChatButtonClick: () => void;
}

class ChatsListHeader extends Block<ChatsListHeaderProps> {
  public static override componentName = 'ChatsListHeader';

  constructor(props: ChatsListHeaderProps) {
    // language=hbs
    super({
      ...props,
      onProfileButtonClick: () => {
        BrowserRouter.getInstance().go(Page.PROFILE);
      },
      onAddChatButtonClick: () => {
        this.props.store.dispatch({
          dialogContent: `{{{ChatDialog
                              isDelete=false
                              withInput=true
                              item="${ChatDialogItem.CHAT}"
                          }}}`,
        });
      },
      onDeleteChatButtonClick: () => {
        this.props.store.dispatch({
          dialogContent: `{{{ChatDialog
                              isDelete=true
                              withInput=false
                              item="${ChatDialogItem.CHAT}"
                          }}}`,
        });
      },
    });
  }

  // language=hbs
  private renderChatOptionsButtons() {
    const currentChat = this.props.store.getState().currentChat;
    const currentUser = this.props.store.getState().user;
    const needDeleteButton = currentChat && (currentChat.createdBy === currentUser?.id);
    const deleteButton = needDeleteButton
      ? `
        {{{Button
          text="Удалить чат"
          className="outlined-button-danger width-150px"
          onClick=onDeleteChatButtonClick
        }}}
      `
      : '';
    return `
      <section class="chats__buttons-container">
        {{{Button
            text="Добавить чат"
            className="contained-button width-150px"
            onClick=onAddChatButtonClick
        }}}
        ${deleteButton}
      </section>
    `;
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
        ${this.renderChatOptionsButtons()}
      </div>
    `;
  }
}

export default withStore(ChatsListHeader);
