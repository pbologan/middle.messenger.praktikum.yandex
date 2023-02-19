import './message-input.css';
import attachmentIcon from '../../../../../public/images/paper-clip.svg';
import { Block } from '../../../../core';
import { validateInput, ValidationRule } from '../../../../core/validator';
import { MessagesService } from '../../../../service/messagesService';
import { withStore, WithStoreProps } from '../../../../hoc';

interface MessageInputProps extends WithStoreProps {
  onSendMessage?: () => void;
  onInputFocus?: (e: FocusEvent) => void;
  onInputBlur?: (e: FocusEvent) => void;
  onAttachmentClick?: () => void;
}

class MessageInput extends Block<MessageInputProps> {
  public static override componentName = 'MessageInput';

  constructor(props: MessageInputProps) {
    super({
      ...props,
      onSendMessage: () => {
        const { message } = this.refs;
        if (message) {
          const { value } = (message.getElement() as HTMLInputElement);
          const validationError = validateInput({
            rule: ValidationRule.MESSAGE,
            value,
          });

          if (!validationError) {
            this.props.store.dispatch(MessagesService.getInstance().sendTextMessage, value);
          }
        }
      },
      onAttachmentClick: () => {
        // TODO: handle attachments click
      },
      onInputBlur: () => {},
      onInputFocus: () => {},
    });
  }

  override render(): string {
    // language=hbs
    return `
      <div class="flex-row-layout messages__message-layout">
          <img
              alt="attachment button icon"
              class="messages__message-attachment-button-icon"
              src="${attachmentIcon}" />
          {{{Button
              onClick=onAttachmentClick
              className="messages__message-attachment-button"
          }}}
          {{{Input
              className="messages__message-input"
              id="message"
              name="message"
              type="text"
              ref="message"
              placeholder="Сообщение"
              onFocus=onInputFocus
              onBlur=onInputBlur
          }}}
          {{{Button
              className="messages__send-message-button"
              onClick=onSendMessage
          }}}
      </div>
    `;
  }
}

export default withStore(MessageInput);
