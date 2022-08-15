import './sign-up.css';
import { Block } from '../../core';
import { RegularExpressions, validateInput, ValidationRule } from '../../core/validator';

type InputObject = {
  id: string;
  placeholder: string;
  validationRule: string;
};

interface SignupPageProps {
  inputElements?: InputObject[];
  onLoginButtonClick?: () => void;
  onRegisterClick?: () => void;
}

export default class SignupPage extends Block<SignupPageProps> {
  constructor(props: SignupPageProps) {
    super({
      ...props,
      inputElements: [
        { id: 'email', placeholder: 'Почта', validationRule: ValidationRule.EMAIL },
        { id: 'login', placeholder: 'Логин', validationRule: ValidationRule.LOGIN },
        { id: 'first_name', placeholder: 'Имя', validationRule: ValidationRule.NAME },
        { id: 'second_name', placeholder: 'Фамилия', validationRule: ValidationRule.NAME },
        { id: 'phone', placeholder: 'Телефон', validationRule: ValidationRule.PHONE },
        { id: 'password', placeholder: 'Пароль', validationRule: ValidationRule.PASSWORD },
        { id: 'repeat_password', placeholder: 'Пароль (ещё раз)', validationRule: ValidationRule.PASSWORD },
      ],
      onLoginButtonClick: () => {
        console.log('on login button click');
      },
      onRegisterClick: () => {
        const registerObject = {} as any;

        Object.keys(this.refs).forEach((key: string) => {
          const component = this.refs[key] as Block<any>;
          const { input } = component.refs;
          if (input) {
            const { value } = input.getElement() as HTMLInputElement;
            registerObject[key] = value;
          }
        });

        const errors: string[] = [];

        Object.keys(RegularExpressions).forEach((key) => {
          const value = String(key).toLowerCase();
          const formValue = registerObject[value];
          const error = validateInput({
            rule: key,
            value: formValue,
          });
          if (error) {
            errors.push(error);
          }
        });

        if (errors.length > 0) {
          console.log('Validation Failed:', errors.join(','));
        } else {
          console.log('errors', errors);
          console.log('Register Data', registerObject);
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
            id="${inputElement.id}"
            ref="${inputElement.id}"
            validationRule="${inputElement.validationRule}"
            type="${inputElement.id}"
            placeholder="${inputElement.placeholder}"
        }}}`;
    }, '');
  }

  override render(): string {
    // language=hbs
    return `
      <main class="layout">
        <form>
          <div class="form-container sign-up__inputs-container">
            <h3 class="header">Регистрация</h3>
            <div class="form__inputs-container sign-up__inputs-container">
                ${this.renderInputElements(this.props.inputElements)}
            </div>
            <div class="form__buttons-container">
              {{{Button
                  className="form__submit-button"
                  text="Зарегистрироваться"
                  onClick=onRegisterClick
              }}}
              {{{Button
                  className="form__register-button"
                  text="Войти"
                  onClick=onLoginButtonClick
              }}}
            </div>
          </div>
        </form>
      </main>
    `;
  }
}
