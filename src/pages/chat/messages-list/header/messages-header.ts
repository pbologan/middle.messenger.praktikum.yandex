import './messages-header.css';
import { Block } from '../../../../core';
import { withStore, WithStoreProps } from '../../../../hoc';
import { BASE_URL } from '../../../../api/urls';
import { AvatarType } from '../../../profile/upload-avatar-dialog/upload-avatar-dialog';

interface MessagesHeaderProps extends WithStoreProps {
  onOptionsButtonClick?: () => void;
  onAvatarClick: () => void;
}

class MessagesHeader extends Block<MessagesHeaderProps> {
  public static override componentName = 'MessagesHeader';

  constructor(props: MessagesHeaderProps) {
    super({
      ...props,
      onOptionsButtonClick: () => {
        this.props.store.dispatch({ isChatMenuShown: true });
      },
      // language=hbs
      onAvatarClick: () => {
        this.props.store.dispatch({
          dialogContent: `{{{UploadAvatarDialog avatarType="${AvatarType.CHAT}"}}}`,
        });
      },
    });
  }

  // language=hbs
  private renderContent() {
    const currentChat = this.props.store.getState().currentChat;
    if (currentChat) {
      const currentUser = this.props.store.getState().user;
      const needOptionsButton = currentChat && (currentChat.createdBy === currentUser?.id);
      const optionsButton = needOptionsButton
        ? `
          {{{Button
            className="messages__chat-options-button"
            onClick=onOptionsButtonClick
          }}}
        `
        : '';

      return `
        {{{EditableAvatar
            smallFontSize=true
            isStub=${currentChat.avatar === null}
            avatar="${BASE_URL}/resources/${currentChat.avatar}"
            className="chats__chat-item__avatar"
            onClick=onAvatarClick
        }}}
        <span class="messages__chat-name">${currentChat.title}</span>
        ${optionsButton}
      `;
    }
    return ``;
  }

  override render(): string {
    return `
      <div class="flex-row-layout messages__chat-name-layout">
        ${this.renderContent()}
      </div>
    `;
  }
}

export default withStore(MessagesHeader);
