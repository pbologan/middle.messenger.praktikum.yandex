import "./chats-list.css";
import { Block } from '../../../core';

type ChatItemObject = {
  active: boolean;
  avatar: string;
  name: string;
  isYourMessage: boolean;
  message: string;
  date: string;
  unreadCount: number;
};

interface ChatsListProps {
  chatItems: ChatItemObject[]
}

export default class ChatsList extends Block<ChatsListProps> {
  public static override componentName = 'ChatsList';

  constructor({ ...props }) {
    super({
      ...props,
      chatItems: [
        {
          active: false,
          avatar: '',
          name: 'Андрей',
          message: 'Сообщение 1',
          date: '9:36',
          isYourMessage: false,
          unreadCount: 2,
        },
        {
          active: false,
          avatar: '',
          name: 'Виктор',
          message: 'Сообщение 2',
          date: '19:40',
          isYourMessage: false,
          unreadCount: 4,
        },
        {
          active: true,
          avatar: '',
          name: 'Сергей',
          message: 'Сообщение 3',
          date: '9:36',
          isYourMessage: true,
          unreadCount: 0,
        },
      ],
    });
  }

  private renderChatItems(items: ChatItemObject[]): string {
    return items.reduce((acc: string, item: ChatItemObject) => {
      // language=hbs
      return `${acc}
        {{{ChatItem
            active=${item.active}
            avatar="${item.avatar}"
            name="${item.name}"
            message="${item.message}"
            date="${item.date}"
            isYourMessage=${item.isYourMessage}
            unreadCount=${item.unreadCount}
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
              ${this.renderChatItems(this.props.chatItems)}
          </div>
      </div>
    `;
  }
}
