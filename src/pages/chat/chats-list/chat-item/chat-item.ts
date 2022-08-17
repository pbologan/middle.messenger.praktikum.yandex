import './chat-item.css';
import { Block } from '../../../../core';

interface ChatItemProps {
  active: boolean;
  avatar: string;
  name: string;
  isYourMessage: boolean;
  message: string;
  date: string;
  unreadCount: number;
}

export default class ChatItem extends Block<ChatItemProps> {
  public static override componentName = 'ChatItem';

  private renderAvatar(avatar: string) {
    // language=hbs
    return avatar ? `<img alt="user avatar" src="{{avatar}}" class="chats__chat-item__avatar"/>`
      : '<div class="chats__chat-item__avatar-stub"></div>';
  }

  private renderMessage(isYourMessage: boolean): string {
    const yourMessage = isYourMessage ? '<span class="chats__chat-item__is-your-message">Вы:&nbsp</span>' : '';
    // language=hbs
    return `${yourMessage}
      <span class="chats__chat-item__message">{{message}}</span>
    `;
  }

  private renderUnreadCount(count: number): string {
    // language=hbs
    return count > 0 ? `<div class="chats__chat-item__unread-count">{{unreadCount}}</div>` : '';
  }

  override render(): string {
    const {
      active, avatar, isYourMessage, unreadCount,
    } = this.props;
    // language=hbs
    return `
      <div class="flex-row-layout chats__chat-item__layout ${active ? "chats__chat-item__chat-active" : ""}">
        ${this.renderAvatar(avatar)}
        <div class="flex-column-layout chats__chat-item__username-message-layout">
          <span class="chats__chat-item__username">{{name}}</span>
          <div class="chats-row-layout chats__chat-item__message-layout">
              ${this.renderMessage(isYourMessage)}
          </div>
        </div>
        <div class="flex-column-layout chats__chat-item__date-count-layout">
            <span class="chats__chat-item__message chats__chat-item__date">{{date}}</span>
            ${this.renderUnreadCount(unreadCount)}
        </div>
      </div>
    `;
  }
}
