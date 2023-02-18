import './upload-avatar-dialog.css';
import { Block } from '../../../core';
import { withStore, WithStoreProps } from '../../../hoc';
import { UsersService } from '../../../service';

interface UploadAvatarDialogProps extends WithStoreProps {
  onUploadClick: () => void;
  onCancelClick: () => void;
  onChooseFileClick: () => void;
  onFileChosen: () => void;
  uploadedFile: File | null;
  error: string | null;
}

class UploadAvatarDialog extends Block<UploadAvatarDialogProps> {
  public static override componentName = 'UploadAvatarDialog';

  constructor(props: UploadAvatarDialogProps) {
    super({
      ...props,
      onUploadClick: () => {
        if (!this.props.uploadedFile) {
          this.setError('Нужно выбрать файл');
        } else {
          if (this.props.error) {
            this.setError('');
          }
          this.props.store.dispatch(
            UsersService.getInstance().changeUserAvatar,
            this.props.uploadedFile,
          );
          this.props.store.dispatch({ dialogContent: null });
        }
      },
      onCancelClick: () => {
        this.props.store.dispatch({ dialogContent: null });
      },
      onChooseFileClick: () => {
        const { fileInput } = this.refs;
        if (fileInput) {
          (fileInput.getElement() as HTMLInputElement).click();
        }
      },
      onFileChosen: () => {
        const { fileInput } = this.refs;
        if (fileInput) {
          const files = (fileInput.getElement() as HTMLInputElement).files;
          if (files && files[0]) {
            console.log(files[0]);
            this.setProps({
              ...this.props,
              uploadedFile: files[0],
            });
          }
        }
      },
    });
  }

  private setError(text: string) {
    const { error } = this.refs;
    if (error) {
      console.log(text, error);
      error.setProps({ text });
    }
  }

  private renderTitle() {
    // language=hbs
    const title = this.props.uploadedFile
      ? 'Файл загружен'
      : 'Выберите файл';
    return `<span class="upload-avatar__title">${title}</span>`;
  }

  private renderFileInput() {
    // language=hbs
    const file = this.props.uploadedFile;
    return file
      ? `
        <span class="upload-avatar__filename">${file.name}</span>
      `
      : `
        <section class="upload-avatar__fileinput-container">
            {{{Input
                className="upload-avatar__fileinput"
                id="fileInput"
                name="fileInput"
                type="file"
                ref="fileInput"
                onChange=onFileChosen
            }}}
            {{{Button
                className="text-button upload-avatar__choose-file-button"
                text="Выбрать файл"
                onClick=onChooseFileClick
            }}}
        </section>
      `;
  }

  private renderButtons() {
    // language=hbs
    return `
      <section class="upload-avatar__buttons-container">
        {{{Button
            className="contained-button width-120px"
            text="Поменять"
            onClick=onUploadClick
        }}}
        {{{Button
            className="outlined-button width-120px"
            text="Отмена"
            onClick=onCancelClick
        }}}
      </section>
    `;
  }

  private renderError() {
    // language=hbs
    return `
      <section class="upload-avatar-error-container">
        {{{Error ref="error"}}}
      </section>
    `;
  }

  override render() {
    // language=hbs
    return `
      <div class="upload-avatar-layout">
        ${this.renderTitle()}
        ${this.renderFileInput()}
        ${this.renderButtons()}
        ${this.renderError()}
      </div>
    `;
  }
}

export default withStore(UploadAvatarDialog);
