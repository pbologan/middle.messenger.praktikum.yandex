import { Block, BrowserRouter } from '../../core';
import { RegularExpressions, validateInput, ValidationRule } from '../../core/validator';
import { Page } from '../../models/app';
import {
  withStore, WithStoreProps, withLoading, WithLoadingProps,
} from '../../hoc';
import { AuthService } from '../../service';

type InputObject = {
  id: string;
  type: string;
  placeholder: string;
  validationRule: string;
};

interface SignupPageProps extends WithStoreProps, WithLoadingProps {
  inputElements?: InputObject[];
  onLoginButtonClick?: () => void;
  onRegisterClick?: () => void;
}

class SignupPage extends Block<SignupPageProps> {
  public static override componentName = 'Sign Up';

  constructor(props: SignupPageProps) {
    super({
      ...props,
      inputElements: [
        {
          id: 'email', type: 'email', placeholder: 'Почта', validationRule: ValidationRule.EMAIL,
        },
        {
          id: 'login', type: 'text', placeholder: 'Логин', validationRule: ValidationRule.LOGIN,
        },
        {
          id: 'first_name', type: 'text', placeholder: 'Имя', validationRule: ValidationRule.NAME,
        },
        {
          id: 'second_name', type: 'text', placeholder: 'Фамилия', validationRule: ValidationRule.NAME,
        },
        {
          id: 'phone', type: 'text', placeholder: 'Телефон', validationRule: ValidationRule.PHONE,
        },
        {
          id: 'password', type: 'password', placeholder: 'Пароль', validationRule: ValidationRule.PASSWORD,
        },
        {
          id: 'repeat_password', type: 'password', placeholder: 'Пароль (ещё раз)', validationRule: ValidationRule.PASSWORD,
        },
      ],
      onLoginButtonClick: () => {
        BrowserRouter.getInstance().go(Page.LOGIN);
      },
      onRegisterClick: () => {
        const registerObject = {} as any;
        let hasError = false;

        Object.keys(this.refs).forEach((key: string) => {
          const component = this.refs[key] as Block<any>;
          const { input } = component.refs;
          if (input) {
            const { value } = input.getElement() as HTMLInputElement;
            registerObject[key] = value;
          }
        });

        this.props.inputElements?.forEach((inputElement) => {
          const formValue = registerObject[inputElement.id];
          const rule = String(RegularExpressions[inputElement.validationRule]);
          if (rule) {
            const validateError = validateInput({
              rule,
              value: formValue,
            });
            if (validateError) {
              hasError = true;
              this.refs[inputElement.id]?.refs['error']?.setProps({ text: validateError });
            }
          }
          if (inputElement.id === 'repeat_password' && registerObject.password !== formValue) {
            this.refs['repeat_password']?.refs['error']?.setProps({ text: 'Пароли не совпадают' });
            hasError = true;
          }
        });

        if (!hasError) {
          delete registerObject.repeat_password;
          this.props.store.dispatch(AuthService.getInstance().signUp, registerObject);
        }
      },
    });
  }

  private renderInputElements(inputElements?: InputObject[]): string {
    if (!inputElements) return '';

    return inputElements.reduce((acc: string, inputElement: InputObject) => {
      // language=hbs
      return `${acc}
        {{{ControlledInput
            fullWidth=true
            className="input"
            id="${inputElement.id}"
            ref="${inputElement.id}"
            validationRule="${inputElement.validationRule}"
            type="${inputElement.type}"
            placeholder="${inputElement.placeholder}"
        }}}`;
    }, '');
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
    // language=hbs
    return `
      <main class="layout">
        <form>
          <div class="form-container">
            <span class="header">Регистрация</span>
            <div class="form__inputs-container">
                ${this.renderInputElements(this.props.inputElements)}
            </div>
            <div class="form__buttons-container">
              {{{Button
                  className="contained-button full-width"
                  text="Зарегистрироваться"
                  onClick=onRegisterClick
              }}}
              {{{Button
                  className="text-button full-width"
                  text="Войти"
                  onClick=onLoginButtonClick
              }}}
            </div>
          </div>
        </form>
        ${this.renderLoader()}
      </main>
    `;
  }
}

export default withStore(withLoading(SignupPage));
