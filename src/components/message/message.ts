import './message.css';
import { Block } from '../../core';
import { withStore, WithStoreProps } from '../../hoc';
import { BASE_URL } from '../../api/urls';
import { getFormattedTime } from '../../utils';

interface MessageProps extends WithStoreProps {
  userId: string;
  time: string;
  content: string;
  file: string;
}

class Message extends Block<MessageProps> {
  public static override componentName = 'Message';

  // language=hbs
  private renderMessage() {
    const currentUserMessage = String(this.props.store.getState().user?.id) === this.props.userId;
    const src = `${BASE_URL}/resources${this.props.file}`;
    const time = getFormattedTime(new Date(this.props.time));
    const content = this.props.file
      ? `<img alt="image message" src="${src}"/>`
      : `<span>${this.props.content}</span>`;

    return `
      <section class="message-container ${currentUserMessage ? "current-user-message" : "another-user-message"}">
        ${content}
        <section class="flex-row-layout message-time-container">
          <span class="message-time">${time}</span>
        </section>
      </section>
    `;
  }

  override render() {
    const currentUserMessage = String(this.props.store.getState().user?.id) === this.props.userId;
    // language=hbs
    return `
        <div class="flex-row-layout message-layout ${currentUserMessage ? "justify-right" : "justify-left"}">
          ${this.renderMessage()}
        </div>
    `;
  }
}

export default withStore(Message);
