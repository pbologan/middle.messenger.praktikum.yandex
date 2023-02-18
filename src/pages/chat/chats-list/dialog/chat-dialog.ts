import './chat-dialog.css';
import { withStore, WithStoreProps } from '../../../../hoc';
import { Block } from '../../../../core';
import { ChatsService } from '../../../../service';

interface ChatDialogProps extends WithStoreProps {
  isDelete: boolean;
  onCancelButtonClick: () => void;
  onAddButtonClick: () => void;
  onDeleteButtonClick: () => void;
}

class ChatDialog extends Block<ChatDialogProps> {
  public static override componentName = 'ChatDialog';

  constructor(props: ChatDialogProps) {
    super({
      ...props,
      onAddButtonClick: () => {
        const { chatNameInput } = this.refs;
        if (chatNameInput) {
          const { input } = chatNameInput.refs;
          const { value } = input?.getElement() as HTMLInputElement;
          if (value) {
            this.props.store.dispatch(ChatsService.getInstance().createChat, { title: value });
            this.props.store.dispatch({ dialogContent: null });
          } else {
            const { error } = chatNameInput.refs;
            if (error) {
              error.setProps({ text: 'Поле не должно быть пустым' });
            }
          }
        }
      },
      onCancelButtonClick: () => {
        this.props.store.dispatch({ dialogContent: null });
      },
      onDeleteButtonClick: () => {
        const chatId = this.props.store.getState().currentChatId;
        this.props.store.dispatch(ChatsService.getInstance().deleteChat, { chatId });
        this.props.store.dispatch({ dialogContent: null });
      },
    });
  }

  private renderTitle() {
    let title = '';
    const isDelete = this.props.isDelete;
    if (isDelete) {
      const currentChatId = this.props.store.getState().currentChatId;
      const currentChat = this.props.store.getState().chatsList.find((chat) => {
        return chat.id === currentChatId;
      });
      if (currentChat) {
        title = `Удалить чат ${currentChat.title}?`;
      }
    } else {
      title = 'Добавление нового чата';
    }
    // language=hbs
    return `<span class="chat-dialog__title">${title}</span>`;
  }

  private renderInput() {
    // language=hbs
    return this.props.isDelete
      ? ''
      : `
        <section class="chat-dialog__input-container">
          {{{ControlledInput
              fullWidth=true
              className="input"
              id="chatName"
              type="text"
              placeholder="Название чата"
              ref="chatNameInput"
          }}}
        </section>

    `;
  }

  // language=hbs
  private renderButtons() {
    const firstButton = this.props.isDelete
      ? `
        {{{Button
            text="Удалить"
            className="contained-button-danger width-120px"
            onClick=onDeleteButtonClick
        }}}
      `
      : `
        {{{Button
            text="Добавить"
            className="contained-button width-120px"
            onClick=onAddButtonClick
        }}}
      `;
    return `
      <section class="chat-dialog__buttons-container">
        ${firstButton}
        {{{Button
            text="Отмена"
            className="outlined-button width-120px"
            onClick=onCancelButtonClick
        }}}
      </section>
    `;
  }

  override render() {
    // language=hbs
    return `
      <div class="chat-dialog__layout">
        ${this.renderTitle()}
        ${this.renderInput()}
        ${this.renderButtons()}
      </div>
    `;
  }
}

export default withStore(ChatDialog);
