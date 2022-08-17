import "./chats-list-header.css";
import { Block } from '../../../../core';

interface ChatsListHeaderProps { }

export default class ChatsListHeader extends Block<ChatsListHeaderProps> {
  public static override componentName = 'ChatsListHeader';

  override render(): string {
  // language=hbs
    return `
      <div class="flex-column-layout chats__search-layout">
        <button class="chats__profile-button">Профиль</button>
        <input class="chats__search-input" placeholder="Поиск">
      </div>
    `;
  }
}
