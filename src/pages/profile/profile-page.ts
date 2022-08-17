import './profile-page.css';
import { Block } from '../../core';
import stubAvatar from '../../../public/images/img-stub.svg';
import { validateInput, ValidationRule } from '../../core/validator';
import { Link, pushPage } from '../../utils/routing/routing';

enum ProfilePageMode {
  VIEWING,
  DATA_EDITING,
  PASSWORD_EDITING,
}

interface UserData {
  avatar: string;
  email: string;
  login: string;
  firstName: string;
  secondName: string;
  nickname: string;
  phone: string;
}

interface ProfilePageProps {
  userData?: UserData;
  mode?: ProfilePageMode;
  onChangeDataClick?: () => void;
  onChangePasswordClick?: () => void;
  onBackButtonClick?: () => void;
  onSaveButtonClick?: () => void;
  onLogout?: () => void;
  passwordsError: string;
}

export default class ProfilePage extends Block<ProfilePageProps> {
  public static override componentName = 'ProfilePage';

  constructor({ ...props }) {
    super({
      ...props,
      userData: {
        avatar: '',
        email: 'p.bologan@gmail.com',
        login: 'p.bologan',
        firstName: 'Павел',
        secondName: 'Бологан',
        nickname: 'Павел',
        phone: '+79999999999',
      },
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
        pushPage(Link.CHAT);
      },
      onSaveButtonClick: () => {
        if (this.props.passwordsError) {
          this.setProps({ passwordsError: '' });
        }
        const userData = this.getUserData();

        if (this.props.mode === ProfilePageMode.DATA_EDITING) {
          const errors = this.checkInputErrors(userData);
          if (errors) {
            console.log(errors);
          } else {
            this.setProps({
              ...this.props,
              userData,
              mode: ProfilePageMode.VIEWING,
            });
          }
        } else {
          this.setProps({ passwordsError: this.checkRepeatPassword() });
          if (!this.checkRepeatPassword()) {
            this.setProps({
              ...this.props,
              mode: ProfilePageMode.VIEWING,
            });
          }
        }
      },
      onLogout: () => {
        pushPage(Link.LOGIN);
      },
      passwordsError: '',
    });
  }

  private getUserData(): UserData {
    const userData = this.props.userData;
    const newUserData: UserData = { ...userData } as UserData;

    if (userData) {
      Object.keys(this.refs).forEach((key) => {
        const item = this.refs[key];
        if (item) {
          const { input } = item.refs;
          if (input) {
            const { value } = input.getElement() as HTMLInputElement;
            if (value) {
              newUserData[key as keyof UserData] = value;
            }
          }
        }
      });
    }
    return newUserData;
  }

  private checkInputErrors(userData: UserData): string {
    const errors: string[] = [];
    Object.keys(userData).forEach((key: string) => {
      const error = validateInput({
        rule: String(key),
        value: userData[key as keyof UserData],
      });
      if (error) {
        errors.push(error);
      }
    });
    return errors.join('\n');
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
    const userName = this.props.mode === ProfilePageMode.VIEWING ? this.props.userData?.firstName : '';
    // language=hbs
    return `
      <div class="flex-column-layout profile__info__photo-name-layout">
        <div class="profile__info__photo-container">
          <img alt="user avatar" class="profile__info__photo" src="${stubAvatar}" />
        </div>
        <span class="profile__info__name">${userName}</span>
      </div>
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
    let nickname = '';
    let phone = '';

    const userData = this.props.userData;

    if (userData) {
      email = userData.email;
      login = userData.login;
      firstName = userData.firstName;
      secondName = userData.secondName;
      nickname = userData.nickname;
      phone = userData.phone;
    }

    let content;

    const profileInfoContent = isProfileEditing ? `
      ${this.getInfoInput(email, 'email', 'email', ValidationRule.EMAIL)}
      ${this.getInfoInput(login, 'text', 'login', ValidationRule.LOGIN)}
      ${this.getInfoInput(firstName, 'text', 'firstName', ValidationRule.NAME)}
      ${this.getInfoInput(secondName, 'text', 'secondName', ValidationRule.NAME)}
      ${this.getInfoInput(nickname, 'text', 'nickname', ValidationRule.NAME)}
      ${this.getInfoInput(phone, 'text', 'phone', ValidationRule.PHONE)}
    ` : `
      ${this.getTitles([email, login, firstName, secondName, nickname, phone], 'justify-right dark-gray')}
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
      <div class="flex-row-layout profile__info-layout">
        ${content}
      </div>
    `;
  }

  private renderButtons(): string {
    // language=hbs
    return this.props.mode === ProfilePageMode.VIEWING ? `
      <div class="flex-column-layout profile__info-layout">
        {{{Button
            text="Изменить данные"
            className="profile__button borderless-button blue cursor-pointer"
            onClick=onChangeDataClick
        }}}
        {{{Button
            text="Изменить пароль"
            className="profile__button borderless-button blue cursor-pointer"
            onClick=onChangePasswordClick
        }}}
        {{{Button
            text="Выйти"
            className="profile__button borderless-button red cursor-pointer"
            onClick=onLogout
        }}}
      </div>
    ` : `
      <div class="flex-row-layout profile__info-save-button-layout">
        {{{Button
            text="Сохранить"
            onClick=onSaveButtonClick
            className="profile__info__save-button"
        }}}
      </div>
    `;
  }

  override render(): string {
    // language=hbs
    return `
      <div class="flex-row-layout profile-layout">
        ${this.renderBackButton()}
        <div class="flex-column-layout align-center profile__main-layout">
            ${this.renderAvatar()}
            ${this.renderInfoBlock()}
            <div class="profile__error-container">
              {{{Error
                ref="passwordsError"
                text="${this.props.passwordsError}"
              }}}
            </div>
            ${this.renderButtons()}
        </div>
      </div>
    `;
  }
}
