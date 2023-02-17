import './messages-list.css';
import { Block } from '../../../core';

interface MessagesListProps { }

export class MessagesList extends Block<MessagesListProps> {
  public static override componentName = 'MessagesList';

  override render(): string {
    // language=hbs
    return `
      <div class="messages__messages-list-layout">
      </div>
    `;
  }
}
