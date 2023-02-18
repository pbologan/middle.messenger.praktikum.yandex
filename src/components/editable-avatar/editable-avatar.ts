import './editable-avatar.css';
import { Block } from '../../core';

interface EditableAvatarProps {
  isStub: boolean;
  smallFontSize?: boolean;
  className?: string;
  avatar: string;
  onClick: () => void;
}

export class EditableAvatar extends Block<EditableAvatarProps> {
  public static override componentName = 'EditableAvatar';

  override render() {
    const layoutClass = this.props.className || 'avatar-layout';
    // language=hbs
    const image = this.props.isStub
      ? '<div class="avatar-stub"></div>'
      : `<img alt="avatar" class="avatar" src="${this.props.avatar}" />`;
    const overlayClass = this.props.smallFontSize
      ? `overlay small-font-size`
      : 'overlay standard-font-size';
    return `
      <div class="${layoutClass}">
          <div class="avatar-container">
              ${image}
              <div class="${overlayClass}">
                  Поменять
                  аватар
              </div>
              {{{Button
                  text="Поменять аватар"
                  className="change-avatar-button"
                  onClick=onClick
              }}}
          </div>
      </div>
    `;
  }
}
