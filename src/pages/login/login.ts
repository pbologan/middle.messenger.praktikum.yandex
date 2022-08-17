import { Block } from '../../core';
import './login.css';
import { validateInput, ValidationRule } from '../../core/validator';

interface LoginPageProps {}

export default class LoginPage extends Block<LoginPageProps> {
  constructor(props: LoginPageProps) {
    super({
      ...props,
      onLoginInput: (e: InputEvent) => {
        const { value } = (e.target as HTMLInputElement);
        console.log('Login Input Value', value);
      },
      onLoginFocus: () => {
        const { login } = this.refs;
        if (login) {
          const { error } = login.refs;
          if (error) {
            error.setProps({ text: '' });
          }
        }
      },
      onPasswordInput: (e: InputEvent) => {
        const { value } = (e.target as HTMLInputElement);
        console.log('Password Input Value', value);
      },
      onPasswordFocus: () => {
        const { password } = this.refs;
        if (password) {
          const { error } = password.refs;
          if (error) {
            error.setProps({ text: '' });
          }
        }
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
          console.log('Validation Failed:', loginError, passwordError);
        } else {
          const loginData = {
            login: loginValue,
            password: passwordValue,
          };
          console.log('Login Data', loginData);
        }
      },
      onRegisterClick: () => {
        console.log('On Register Button Click');
      },
    });
  }

  override render(): string {
    // language=hbs
    return `
      <main class="layout">
        <form>
          <div class="form-container">
            <h3 class="header">Вход</h3>
            <div class="form__inputs-container">
              {{{ControlledInput
                  className="input"
                  id="login"
                  ref="login"
                  validationRule="${ValidationRule.LOGIN}"
                  type="text"
                  placeholder="Логин"
              }}}
              {{{ControlledInput
                  className="input"
                  id="password"
                  ref="password"
                  validationRule="${ValidationRule.PASSWORD}"
                  type="password"
                  placeholder="Пароль"
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
