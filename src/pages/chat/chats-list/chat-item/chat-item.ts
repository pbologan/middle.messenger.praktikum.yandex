import './chat-item.css';
import { Block } from '../../../../core';
import { BASE_URL } from '../../../../api/urls';
import { getFormattedTime } from '../../../../utils';

interface ChatItemProps {
  id: number;
  active: boolean;
  avatar: string | null;
  name: string;
  isYourMessage: boolean;
  message: string | null;
  date: string;
  unreadCount: number;
  onClick: (chatId: number) => void;
  events: {
    click?: () => void;
  }
}

export class ChatItem extends Block<ChatItemProps> {
  public static override componentName = 'ChatItem';

  constructor(props: ChatItemProps) {
    super({
      ...props,
      events: {
        click: () => props.onClick(props.id),
      },
    });
  }

  // language=hbs
  private renderAvatar(avatar: string | null) {
    return avatar
      ? `<img alt="chat avatar" src=${BASE_URL}/resources/${avatar} class="chats__chat-item__avatar"/>`
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

  // language=hbs
  private renderDate(date?: string) {
    if (date) {
      const time = getFormattedTime(new Date(date));
      return `<span class="chats__chat-item__message chats__chat-item__date">${time}</span>`;
    }
    return '';
  }

  override render(): string {
    const {
      active, isYourMessage, unreadCount, avatar, date,
    } = this.props;
    // language=hbs
    return `
      <div class="flex-row-layout chats__chat-item__layout ${active ? "chats__chat-item__chat-active" : ""}">
        ${this.renderAvatar(avatar)}
        <div class="flex-column-layout chats__chat-item__username-message-layout">
          <span class="chats__chat-item__chatname">{{name}}</span>
          <div class="chats-row-layout chats__chat-item__message-layout">
              ${this.renderMessage(isYourMessage)}
          </div>
        </div>
        <div class="flex-column-layout chats__chat-item__date-count-layout">
            ${this.renderDate(date)}
            ${this.renderUnreadCount(unreadCount)}
        </div>
      </div>
    `;
  }
}
