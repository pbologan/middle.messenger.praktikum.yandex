import "./chat-page.css";
import { Block } from '../../core';

interface ChatPageProps { }

export class ChatPage extends Block<ChatPageProps> {
  public static override componentName = 'Chat Page';

  override render() {
    // language=hbs
    return `
      <div class="flex-row-layout">
        <div class="flex-column-layout chats-layout">
          {{{ChatsList}}}
        </div>
          <div class="flex-column-layout messages-layout">
            {{{MessagesHeader}}}
            {{{MessagesList}}}
            {{{MessageInput}}}
          </div>
      </div>
    `;
  }
}
