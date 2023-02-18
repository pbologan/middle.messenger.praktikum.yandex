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
          ${this.renderDialog()}
          ${this.renderLoader()}
      </div>
    `;
  }
}

export default withStore(withLoading(ChatPage));
