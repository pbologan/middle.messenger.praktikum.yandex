import { Block, BrowserRouter } from '../../core';
import './login.css';
import { validateInput, ValidationRule } from '../../core/validator';
import { Page } from '../../models/app';
import {
  withStore, WithStoreProps, withLoading, WithLoadingProps,
} from '../../hoc';
import { AuthService } from '../../service';

interface LoginPageProps extends WithStoreProps, WithLoadingProps {
  onLoginInput: (e: InputEvent) => void;
  onLoginFocus: () => void;
  onPasswordInput: (e: InputEvent) => void;
  onPasswordFocus: () => void;
  onLoginButtonClick: () => void;
  onRegisterClick: () => void;
}

class LoginPage extends Block<LoginPageProps> {
  public static override componentName = 'Login';

  constructor(props: LoginPageProps) {
    super({
      ...props,
      onLoginFocus: () => {
        const { login } = this.refs;
        if (login) {
          const { error } = login.refs;
          if (error) {
            error.setProps({ text: '' });
          }
        }
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
        this.props.store.dispatch({ loginFormError: null });
        const login = (this.element?.querySelector('[name=login]') as HTMLInputElement).value;
        const password = (this.element?.querySelector('[name=password]') as HTMLInputElement).value;

        const loginError = validateInput({
          rule: ValidationRule.LOGIN,
          value: login,
        });

        const passwordError = validateInput({
          rule: ValidationRule.PASSWORD,
          value: password,
        });

        if (loginError) {
          this.refs['login']?.refs['error']?.setProps({ text: loginError });
        }

        if (passwordError) {
          this.refs['password']?.refs['error']?.setProps({ text: passwordError });
        }

        if (!loginError && !passwordError) {
          const loginData = { login, password };
          this.props.store.dispatch(AuthService.getInstance().login, loginData);
        }
      },
      onRegisterClick: () => {
        BrowserRouter.getInstance().go(Page.SIGN_UP);
      },
    });
  }

  private renderLoader() {
    if (this.props.isLoading()) {
      // language=hbs
      return `
        {{{Loader}}}
      `;
    }
    return '';
  }

  override render(): string {
    const loginError = this.props.store.getState().loginFormError || '';
    // language=hbs
    return `
      <main class="layout">
        <form>
          <div class="form-container">
            <span class="header">Вход</span>
            <div class="form__inputs-container">
              {{{ControlledInput
                  fullWidth=true
                  className="input"
                  id="login"
                  ref="login"
                  validationRule="${ValidationRule.LOGIN}"
                  type="text"
                  placeholder="Логин"
              }}}
              {{{ControlledInput
                  fullWidth=true
                  className="input"
                  id="password"
                  ref="password"
                  validationRule="${ValidationRule.PASSWORD}"
                  type="password"
                  placeholder="Пароль"
              }}}
            </div>
            <div>
                <span class="form__login-error">${loginError}</span>
            </div>
            <div class="form__buttons-container">
              {{{Button
                  className="contained-button full-width"
                  text="Войти"
                  onClick=onLoginButtonClick
              }}}
              {{{Button 
                  className="text-button full-width" 
                  text="Регистрация" 
                  onClick=onRegisterClick
              }}}
            </div>
          </div>
        </form>
        ${this.renderLoader()}
      </main>
    `;
  }
}

export default withStore(withLoading(LoginPage));
