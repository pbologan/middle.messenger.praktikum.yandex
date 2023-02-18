import './chats-list-header.css';
import { Block, BrowserRouter } from '../../../../core';
import { Page } from '../../../../models/app';
import { withStore, WithStoreProps } from '../../../../hoc';

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
        this.props.store.dispatch({ dialogContent: `{{{ChatDialog isDelete=false}}}` });
      },
      onDeleteChatButtonClick: () => {
        this.props.store.dispatch({ dialogContent: `{{{ChatDialog isDelete=true}}}` });
      },
    });
  }

  // language=hbs
  private renderChatOptionsButtons() {
    const deleteButton = this.props.store.getState().currentChatId
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
