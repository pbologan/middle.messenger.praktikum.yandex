import './messages-list.css';
import { Block } from '../../../core';
import { withStore, WithStoreProps } from '../../../hoc';
import { Message } from '../../../api/websocket-types';

interface MessagesListProps extends WithStoreProps { }

class MessagesList extends Block<MessagesListProps> {
  public static override componentName = 'MessagesList';

  private renderMessages() {
    const messages = this.props.store.getState().currentChatMessages;
    if (messages.length === 0) {
      return '';
    }
    // language=hbs
    return messages.reverse().reduce((acc: string, message: Message) => {
      // language=hbs
      return `${acc}
        {{{Message
            userId="${message.userId}"
            time="${message.time}"
            content="${message.content}"
            file="${message.file ? message.file.path : ''}"
        }}}
      `;
    }, '');
  }

  override render(): string {
    // language=hbs
    return `
      <div class="messages__messages-list-layout">
        ${this.renderMessages()}
      </div>
    `;
  }
}

export default withStore(MessagesList);
