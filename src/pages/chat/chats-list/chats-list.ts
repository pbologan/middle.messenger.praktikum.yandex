import "./chats-list.css";
import { Block } from '../../../core';
import {
  withLoading, WithLoadingProps, withStore, WithStoreProps,
} from '../../../hoc';
import { Chat } from '../../../models/chats';
import { ChatsService } from '../../../service';
import { MessagesService } from '../../../service/messagesService';

interface ChatsListProps extends WithStoreProps, WithLoadingProps {
  onChatItemClick: (chatId: number) => void;
}

class ChatsList extends Block<ChatsListProps> {
  public static override componentName = 'ChatsList';

  constructor(props: ChatsListProps) {
    super({
      ...props,
      onChatItemClick: (chatId: number) => {
        const { currentChat, chatsList } = this.props.store.getState();
        if (currentChat?.id !== chatId) {
          const foundChat = chatsList.find((chat) => chat.id === chatId);
          if (foundChat) {
            this.props.store.dispatch({ currentChat: foundChat });
            this.props.store.dispatch(MessagesService.getInstance().openConnection, {
              userId: this.props.store.getState().user?.id,
              chatId,
            });
            this.props.store.dispatch(
              ChatsService.getInstance().getCurrentChatUsers,
              { id: chatId },
            );
            this.props.store.dispatch(MessagesService.getInstance().getMessages, chatId);
          }
        }
      },
    });
  }

  private renderChatItems(): string {
    const { chatsList, currentChat, user } = this.props.store.getState();
    return chatsList.reduce((acc: string, chat: Chat) => {
      const avatar = chat.avatar || '';
      // language=hbs
      return `${acc}
        {{{ChatItem
            id=${chat.id}
            active=${chat.id === currentChat?.id}
            avatar="${avatar}"
            name="${chat.title}"
            message="${chat.lastMessage?.content || ''}"
            date="${chat.lastMessage?.time || ''}"
            isYourMessage=${chat.createdBy === user?.id}
            unreadCount="${chat.unreadCount}"
            onClick=onChatItemClick
        }}}
      `;
    }, '');
  }

  override render(): string {
    // language=hbs
    return `
      <div class="flex-column-layout chats-layout">
        {{{ChatsListHeader}}}
          <div class="flex-column-layout chats__chats-list__layout">
              ${this.renderChatItems()}
          </div>
      </div>
    `;
  }
}

export default withStore(withLoading(ChatsList));
