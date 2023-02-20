import './chat-dialog.css';
import { withStore, WithStoreProps } from '../../../../hoc';
import { Block } from '../../../../core';
import { ChatsService } from '../../../../service';
import { ChatUserActionData } from '../../../../api/api-types';

export enum ChatDialogItem {
  CHAT = 'chat',
  USER = 'user',
}

interface ChatDialogProps extends WithStoreProps {
  isDelete: boolean;
  onCancelButtonClick: () => void;
  onAddButtonClick: () => void;
  onDeleteButtonClick: () => void;
  item: ChatDialogItem,
  withInput: boolean,
}

class ChatDialog extends Block<ChatDialogProps> {
  public static override componentName = 'ChatDialog';

  constructor(props: ChatDialogProps) {
    super({
      ...props,
      onAddButtonClick: () => {
        const { chatInput } = this.refs;
        if (chatInput) {
          const { input } = chatInput.refs;
          const { value } = input?.getElement() as HTMLInputElement;
          if (value) {
            let action;
            let payload;
            if (this.props.item === ChatDialogItem.USER) {
              action = ChatsService.getInstance().addUserToChat;
              payload = {
                userLogin: { login: value },
                chatId: this.props.store.getState().currentChat?.id,
                currentChatUsers: this.props.store.getState().currentChatUsers,
              } as ChatUserActionData;
            } else {
              action = ChatsService.getInstance().createChat;
              payload = { title: value };
            }
            this.props.store.dispatch(action, payload);
            this.props.store.dispatch({ dialogContent: null });
          } else {
            const { error } = chatInput.refs;
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
        let action;
        let payload;
        if (this.props.item === ChatDialogItem.CHAT) {
          action = ChatsService.getInstance().deleteChat;
          const chatId = this.props.store.getState().currentChat?.id;
          if (chatId) {
            payload = { chatId };
          }
          this.props.store.dispatch(action, payload);
          this.props.store.dispatch({ dialogContent: null });
        } else {
          const { chatInput } = this.refs;
          if (chatInput) {
            const { currentChat, currentChatUsers } = this.props.store.getState();
            const { input } = chatInput.refs;
            const { value } = input?.getElement() as HTMLInputElement;
            if (value) {
              action = ChatsService.getInstance().removeUserFromChat;
              payload = {
                userLogin: { login: value },
                chatId: currentChat?.id,
                currentChatUsers,
              } as ChatUserActionData;
              this.props.store.dispatch(action, payload);
              this.props.store.dispatch({ dialogContent: null });
            } else {
              const { error } = chatInput.refs;
              if (error) {
                error.setProps({ text: 'Поле не должно быть пустым' });
              }
            }
          }
        }
      },
    });
  }

  private renderTitle() {
    const item = this.props.item === ChatDialogItem.CHAT ? 'чат' : 'пользователя';
    let title = '';
    const isDelete = this.props.isDelete;
    if (isDelete) {
      const currentChat = this.props.store.getState().currentChat;
      if (currentChat) {
        const name = this.props.item === ChatDialogItem.CHAT
          ? `${currentChat.title}?`
          : '';
        title = `Удалить ${item} ${name}`;
      }
    } else {
      title = `Добавить ${item}`;
    }
    // language=hbs
    return `<span class="chat-dialog__title">${title}</span>`;
  }

  private renderInput() {
    const placeholder = this.props.item === ChatDialogItem.CHAT
      ? 'Название чата'
      : 'Логин пользователя';
    // language=hbs
    return this.props.withInput
      ? `
        <section class="chat-dialog__input-container">
          {{{ControlledInput
              fullWidth=true
              className="input"
              id="chatInput"
              type="text"
              placeholder="${placeholder}"
              ref="chatInput"
          }}}
        </section>
      `
      : '';
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
