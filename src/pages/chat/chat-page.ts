import "./chat-page.css";
import { Block } from '../../core';
import {
  withLoading, WithLoadingProps, withStore, WithStoreProps,
} from '../../hoc';

interface ChatPageProps extends WithStoreProps, WithLoadingProps { }

class ChatPage extends Block<ChatPageProps> {
  public static override componentName = 'Chat Page';

  private renderDialog() {
    const dialogContent = this.props.store.getState().dialogContent;
    if (dialogContent) {
      // language=hbs
      return `{{{Modal}}}`;
    }
    return '';
  }

  private renderLoader() {
    if (this.props.isLoading()) {
      // language=hbs
      return `
        {{{Loader}}}
      `;
    }
    return '';
  }

  private renderChatMenu() {
    if (this.props.store.getState().isChatMenuShown) {
      // language=hbs
      return `{{{ChatMenu}}}`;
    }
    return '';
  }

  private renderMessagesBlock() {
    if (this.props.store.getState().currentChat) {
      // language=hbs
      return `
        <div class="flex-column-layout messages-layout">
          {{{MessagesHeader}}}
          {{{MessagesList}}}
          {{{MessageInput}}}
        </div>
      `;
    }
    return '';
  }

  override render() {
    // language=hbs
    return `
      <main class="flex-row-layout">
        <section class="flex-column-layout chats-layout">
          {{{ChatsList}}}
        </section>
        ${this.renderMessagesBlock()}
        ${this.renderDialog()}
        ${this.renderChatMenu()}
        ${this.renderLoader()}
      </main>
    `;
  }
}

export default withStore(withLoading(ChatPage));
