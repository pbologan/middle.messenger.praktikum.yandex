import { Block } from '../../core';
import './login-sign-up.css';
import { validateInput, ValidationRule } from '../../core/validator';

interface LoginPageProps {}

export default class LoginPage extends Block {
  constructor(props: LoginPageProps) {
    super({
      ...props,
      onLoginInput: (e: InputEvent) => {
        const { value } = (e.target as HTMLInputElement);
        // eslint-disable-next-line no-console
        console.log('Login Input Value', value);
      },
      onLoginFocus: () => {
        this.refs.login.refs.error.setProps({ text: '' });
      },
      onPasswordInput: (e: InputEvent) => {
        const { value } = (e.target as HTMLInputElement);
        // eslint-disable-next-line no-console
        console.log('Password Input Value', value);
      },
      onPasswordFocus: () => {
        this.refs.password.refs.error.setProps({ text: '' });
      },
      onLoginButtonClick: () => {
        const loginValue = (this.element?.querySelector('[name=login]') as HTMLInputElement).value;
        const passwordValue = (this.element?.querySelector('[name=password]') as HTMLInputElement).value;

        const loginError = validateInput({
          rule: ValidationRule.LOGIN,
          value: loginValue,
        });

        const passwordError = validateInput({
          rule: ValidationRule.PASSWORD,
          value: passwordValue,
        });

        if (loginError || passwordError) {
          // eslint-disable-next-line no-console
          console.log('Validation Failed:', loginError, passwordError);
        } else {
          const loginData = {
            login: loginValue,
            password: passwordValue,
          };
          // eslint-disable-next-line no-console
          console.log('Login Data', loginData);
        }
      },
      onRegisterClick: () => {
        // eslint-disable-next-line no-console
        console.log('On Register Button Click');
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  render(): string {
    // language=hbs
    return `
      <main class="layout">
        <form>
          <div class="form-container">
            <h3 class="header">Вход</h3>
            <div class="form__inputs-container">
              {{{ControlledInput
                  id="login"
                  ref="login"
                  errorRef="loginError"
                  validationRule="${ValidationRule.LOGIN}"
                  type="text"
                  placeholder="Логин"
                  onFocus=onLoginFocus
                  onInput=onLoginInput
              }}}
              {{{ControlledInput
                  id="password"
                  ref="password"
                  errorRef="passwordError"
                  validationRule="${ValidationRule.PASSWORD}"
                  type="password"
                  placeholder="Пароль"
                  onFocus=onPasswordFocus
                  onInput=onPasswordInput
              }}}
            </div>
            <div class="form__buttons-container">
              {{{Button
                  className="form__submit-button"
                  text="Войти"
                  onClick=onLoginButtonClick
              }}}
              {{{Button 
                  className="form__register-button" 
                  text="Регистрация" 
                  onClick=onRegisterClick
              }}}
            </div>
          </div>
        </form>
      </main>
    `;
  }
}
