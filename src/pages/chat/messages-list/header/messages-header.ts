import "./messages-header.css";
import { Block } from '../../../../core';

interface MessagesHeaderProps {}

export default class MessagesHeader extends Block<MessagesHeaderProps> {
  public static override componentName = 'MessagesHeader';

  override render(): string {
    // language=hbs
    return `
      <div class="flex-row-layout messages__chat-name-layout">
        <div class="messages__avatar-stub"></div>
        <span class="messages__username">Павел</span>
        <div class="messages__chat-options-button"></div>
      </div>
    `;
  }
}
