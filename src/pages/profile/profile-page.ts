import './profile-page.css';
import { Block, BrowserRouter } from '../../core';
import stubAvatar from '../../../public/images/img-stub.svg';
import { validateInput, ValidationRule } from '../../core/validator';
import { AuthService, UsersService } from '../../service';
import {
  withStore,
  WithStoreProps,
  withLoading,
  WithLoadingProps,
  withUser,
  WithUserProps,
} from '../../hoc';
import { transformUserToUserData, UserFormData } from '../../models/user';
import { Page } from '../../models/app';
import { BASE_URL } from '../../api/urls';
import { AvatarType } from './upload-avatar-dialog/upload-avatar-dialog';

enum ProfilePageMode {
  VIEWING,
  DATA_EDITING,
  PASSWORD_EDITING,
}

const ProfileValidationRules: Record<string, ValidationRule> = {
  login: ValidationRule.LOGIN,
  first_name: ValidationRule.NAME,
  second_name: ValidationRule.NAME,
  display_name: ValidationRule.NAME,
  phone: ValidationRule.PHONE,
  email: ValidationRule.EMAIL,
};

interface ProfilePageProps extends WithStoreProps, WithUserProps, WithLoadingProps {
  mode?: ProfilePageMode;
  onChangeDataClick?: () => void;
  onChangePasswordClick?: () => void;
  onBackButtonClick?: () => void;
  onSaveButtonClick?: () => void;
  onLogout?: () => void;
  passwordsError: string;
  onAvatarClick: () => void;
  onAvatarUpload: (file: File) => void;
}

class ProfilePage extends Block<ProfilePageProps> {
  public static override componentName = 'Profile Page';

  constructor(props: ProfilePageProps) {
    super({
      ...props,
      mode: ProfilePageMode.VIEWING,
      onChangeDataClick: () => {
        this.setProps({
          ...this.props,
          mode: ProfilePageMode.DATA_EDITING,
        });
      },
      onChangePasswordClick: () => {
        this.setProps({
          ...this.props,
          mode: ProfilePageMode.PASSWORD_EDITING,
        });
      },
      onBackButtonClick: () => {
        if (this.props.mode === ProfilePageMode.VIEWING) {
          BrowserRouter.getInstance().go(Page.CHAT);
        } else {
          this.setProps({
            ...this.props,
            mode: ProfilePageMode.VIEWING,
          });
        }
      },
      onSaveButtonClick: () => {
        if (this.props.passwordsError) {
          this.setProps({
            ...this.props,
            passwordsError: '',
          });
        }
        const userData = this.getUserFormData();

        if (this.props.mode === ProfilePageMode.DATA_EDITING) {
          const errors = this.checkInputErrors(userData);
          if (!errors) {
            this.props.store.dispatch(UsersService.getInstance().editUserProfile, userData);
            this.setProps({
              ...this.props,
              mode: ProfilePageMode.VIEWING,
            });
          }
        } else {
          this.setProps({ ...this.props, passwordsError: this.checkRepeatPassword() });
          const passwords = this.getOldAndNewPasswords();
          if (passwords && !this.checkRepeatPassword()) {
            this.props.store.dispatch(UsersService.getInstance().changeUserPassword, passwords);
            this.setProps({
              ...this.props,
              mode: ProfilePageMode.VIEWING,
            });
          }
        }
      },
      onLogout: () => {
        this.props.store.dispatch(AuthService.getInstance().logout);
      },
      // language=hbs
      onAvatarClick: () => {
        this.props.store.dispatch({
          dialogContent: `{{{UploadAvatarDialog avatarType="${AvatarType.USER}"}}}`,
        });
      },
      onAvatarUpload: (file: File) => {
        this.props.store.dispatch(UsersService.getInstance().changeUserAvatar, file);
      },
      passwordsError: '',
    });
  }

  private getUserFormData(): UserFormData | null {
    const userData = this.props.user;

    if (userData) {
      const refsData = {} as any;
      Object.keys(this.refs).forEach((key: string) => {
        const item = this.refs[key];
        if (item) {
          const { input } = item.refs;
          if (input) {
            const { value } = input.getElement() as HTMLInputElement;
            if (value) {
              refsData[key] = value;
            }
          }
        }
      });
      delete refsData.passwordsError;
      return transformUserToUserData(refsData);
    }
    return null;
  }

  private checkInputErrors(userData: UserFormData | null): string {
    if (!userData) {
      return '';
    }

    const errors: string[] = [];
    Object.keys(userData).forEach((key: string) => {
      if (key !== 'display_name') {
        const value = String(userData[key as keyof UserFormData]);
        const rule = ProfileValidationRules[key];
        if (rule) {
          const error = validateInput({ rule, value });
          if (error) {
            errors.push(error);
          }
        }
      }
    });
    return errors.join('\n');
  }

  private getOldAndNewPasswords() {
    const {
      oldPassword,
      newPassword,
    } = this.refs;

    if (newPassword && oldPassword) {
      const newPassInput = newPassword.refs['input'];
      const oldPasswordInput = oldPassword.refs['input'];
      if (newPassInput && oldPasswordInput) {
        const newPassValue = (newPassInput.getElement() as HTMLInputElement).value;
        const oldPassValue = (oldPasswordInput.getElement() as HTMLInputElement).value;
        return {
          oldPassword: oldPassValue,
          newPassword: newPassValue,
        };
      }
    }
    return null;
  }

  private checkRepeatPassword(): string {
    const {
      newPassword,
      repeatNewPassword,
    } = this.refs;

    if (newPassword && repeatNewPassword) {
      const newPassInput = newPassword.refs['input'];
      const repeatPassInput = repeatNewPassword.refs['input'];
      if (newPassInput && repeatPassInput) {
        const newPassValue = (newPassInput.getElement() as HTMLInputElement).value;
        const repeatPassValue = (repeatPassInput.getElement() as HTMLInputElement).value;

        return newPassValue === repeatPassValue ? '' : 'Пароли не совпадают';
      }
    }
    return '';
  }

  private renderBackButton(): string {
    // language=hbs
    return `
      <div class="flex-column-layout profile__back-button-layout">
        {{{Button
            className="profile__back-button"
            onClick=onBackButtonClick
        }}}
      </div>
    `;
  }

  private renderAvatar(): string {
    const userName = this.props.mode === ProfilePageMode.VIEWING ? this.props.user?.firstName : '';
    const avatar = this.props.user?.avatar
      ? `${BASE_URL}/resources${this.props.user?.avatar}`
      : stubAvatar;
    // language=hbs
    return `
      <section class="flex-column-layout profile__info__photo-name-layout">
        {{{EditableAvatar
            isStub=false
            avatar="${avatar}"
            onClick=onAvatarClick
        }}}
        <span class="profile__info__name">${userName}</span>
      </section>
    `;
  }

  private getInfoTitle(title: string, additionalClass?: string): string {
    // language=hbs
    return `
      <div class="flex-row-layout profile__info__row ${additionalClass}">
        <span>${title}</span>
      </div>
    `;
  }

  private getInfoInput(value: string, inputType: 'text' | 'password' | 'email', ref: string, validationRule: ValidationRule): string {
    // language=hbs
    return `
      <div class="flex-row-layout profile__info__row justify-right dark-gray">
        {{{ControlledInput
            className="profile__editable-row"
            id="${ref}"
            ref="${ref}"
            type="${inputType}"
            value="${value}"
            validationRule="${validationRule}"
        }}}
      </div>
    `;
  }

  private getTitles(titles: string[], additionalClass?: string): string {
    const content = titles.reduce((acc: string, title: string) => {
      return `${acc}
      ${this.getInfoTitle(title, additionalClass)}`;
    }, '');
    // language=hbs
    return `
        <div class="flex-column-layout profile__info__row-layout">
            ${content}
        </div>
      `;
  }

  private renderInfoBlock(): string {
    const { mode } = this.props;
    const isPasswordEditing = mode === ProfilePageMode.PASSWORD_EDITING;
    const isProfileEditing = mode === ProfilePageMode.DATA_EDITING;
    const inputType = isPasswordEditing ? 'password' : 'text';

    let email = '';
    let login = '';
    let firstName = '';
    let secondName = '';
    let displayName = '';
    let phone = '';

    const userData = this.props.user;

    if (userData) {
      email = userData.email;
      login = userData.login;
      firstName = userData.firstName;
      secondName = userData.secondName;
      displayName = userData.displayName || '';
      phone = userData.phone;
    }

    let content;

    const profileInfoContent = isProfileEditing ? `
      ${this.getInfoInput(email, 'email', 'email', ValidationRule.EMAIL)}
      ${this.getInfoInput(login, 'text', 'login', ValidationRule.LOGIN)}
      ${this.getInfoInput(firstName, 'text', 'firstName', ValidationRule.NAME)}
      ${this.getInfoInput(secondName, 'text', 'secondName', ValidationRule.NAME)}
      ${this.getInfoInput(displayName, 'text', 'displayName', ValidationRule.NAME)}
      ${this.getInfoInput(phone, 'text', 'phone', ValidationRule.PHONE)}
    ` : `
      ${this.getTitles([email, login, firstName, secondName, displayName, phone], 'justify-right dark-gray')}
    `;

    const passwordInfoContent = `
      ${this.getInfoInput('', inputType, 'oldPassword', ValidationRule.PASSWORD)}
      ${this.getInfoInput('', inputType, 'newPassword', ValidationRule.PASSWORD)}
      ${this.getInfoInput('', inputType, 'repeatNewPassword', ValidationRule.PASSWORD)}
    `;

    // language=hbs
    if (isPasswordEditing) {
      content = `
        <div class="flex-column-layout profile__info__row-layout">
          ${this.getTitles(['Старый пароль', 'Новый пароль', 'Повторите новый пароль'])}
        </div>
        <div class="flex-column-layout profile__info__row-layout">
          ${passwordInfoContent}
        </div>
      `;
    } else {
      content = `
        <div class="flex-column-layout profile__info__row-layout">
          ${this.getTitles(['Почта', 'Логин', 'Имя', 'Фамилия', 'Имя в чате', 'Телефон'])}
        </div>
        <div class="flex-column-layout profile__info__row-layout">
          ${profileInfoContent}
        </div>
      `;
    }

    return `
      <section class="flex-row-layout profile__info-layout">
        ${content}
      </section>
    `;
  }

  private renderButtons(): string {
    // language=hbs
    return this.props.mode === ProfilePageMode.VIEWING ? `
      <section class="flex-column-layout profile__info-layout">
        {{{Button
            text="Изменить данные"
            className="text-button profile__button"
            onClick=onChangeDataClick
        }}}
        {{{Button
            text="Изменить пароль"
            className="text-button profile__button"
            onClick=onChangePasswordClick
        }}}
        {{{Button
            text="Выйти"
            className="text-button profile__button red"
            onClick=onLogout
        }}}
      </section>
    ` : `
      <section class="flex-row-layout profile__info-save-button-layout">
        {{{Button
            text="Сохранить"
            onClick=onSaveButtonClick
            className="profile__info__save-button"
        }}}
      </section>
    `;
  }

  private renderDialog() {
    const dialogContent = this.props.store.getState().dialogContent;
    if (dialogContent) {
      // language=hbs
      return `{{{Modal}}}`;
    }
    return '';
  }

  private renderLoader() {
    if (this.props.store.getState().isLoading) {
      // language=hbs
      return `{{{Loader}}}`;
    }
    return '';
  }

  override render(): string {
    // language=hbs
    return `
      <main class="flex-row-layout profile-layout">
        ${this.renderBackButton()}
        <section class="flex-column-layout profile__main-layout">
            ${this.renderAvatar()}
            ${this.renderInfoBlock()}
            <div class="profile__error-container">
              {{{Error
                ref="passwordsError"
                text="${this.props.passwordsError}"
              }}}
            </div>
            ${this.renderButtons()}
        </section>
        ${this.renderDialog()}
        ${this.renderLoader()}
      </main>
    `;
  }
}

export default withStore(withUser(withLoading(ProfilePage)));
