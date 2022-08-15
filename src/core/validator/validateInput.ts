type ValidationInput = {
  rule: ValidationRule | string;
  value : string;
};

type RegularExpressionType = {
  expression: string;
  error: string;
};

export enum ValidationRule {
  LOGIN = 'login',
  PASSWORD = 'password',
  NAME = 'name',
  EMAIL = 'email',
  PHONE = 'phone',
  MESSAGE = 'message',
}

export const RegularExpressions: Record<ValidationRule | string, RegularExpressionType> = {
  name: {
    expression: '(^[A-Z]{1}[a-z\\-]+$)|(^[А-Я]{1}[а-я\\-]+$)',
    error: 'Правило: латиница или кириллица, первая буква заглавная, без пробелов и без цифр, нет спецсимволов (допустим только дефис)',
  },
  login: {
    expression: '^(?=.*[A-Za-z0-9]$)[A-Za-z][A-Za-z\\d.-]{3,20}$',
    error: 'Логин должен быть от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание)',
  },
  password: {
    expression: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,40}$',
    error: 'Пароль должен быть от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра',
  },
  email: {
    expression: '^(?!.*@.*@.*$)(?!.*@.*--.*\\..*$)(?!.*@.*-\\..*$)(?!.*@.*-$)((.*)?@.+(\\..{1,11})?)$',
    error: 'Правило: латиница, может включать цифры и спецсимволы вроде дефиса, обязательно должна быть «собака» (@) и точка после неё, но перед точкой обязательно должны быть буквы',
  },
  phone: {
    expression: '(^(?!\\+.*\\(.*\\).*--.*$)(?!\\+.*\\(.*\\).*-$)(\\+[0-9]{1,3}\\([0-9]{1,3}\\)[0-9]{1}([-0-9]{0,8})?([0-9]{0,1})?)$)|(^[0-9]{1,4}$)',
    error: 'Телефон должен быть от 10 до 15 символов, состоять из цифр, может начинается с плюса',
  },
  message: {
    expression: '^(?!\\s*$).+',
    error: 'Сообщение не должно быть пустым',
  },
};

export const validateInput = (input: ValidationInput): string => {
  const { rule, value } = input;

  const reObject = RegularExpressions[rule];

  if (!reObject) return '';

  const re = new RegExp(reObject.expression);

  return re.test(value) ? '' : reObject.error;
};
