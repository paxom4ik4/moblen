const REQUIRED = 'Обязательное поле';
const PASSWORD_MATCH = 'Пароли несовпадают';
const WRONG_MAIL_FORMAT = 'Неверный формат Email';
const WRONG_PHONE_FORMAT = 'Неверный формат телефона';
const PASSWORD_CHECK_ERROR = 'Минимум 8 символов, cпецсимвол, верхний регистр';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const validateFn = (values) => {
  const errors = {};
  if (!values.login) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    errors.login = REQUIRED;
  } else if (
    /\D/.test(values.login) &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.login)
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    errors.login = WRONG_MAIL_FORMAT;
  } else if (!/\D/.test(values.login) && values.login.length < 11) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    errors.login = WRONG_PHONE_FORMAT;
  }

  if (!values.name) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    errors.name = REQUIRED;
  }

  if (!values.surname) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    errors.surname = REQUIRED;
  }

  if (!values.password) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    errors.password = REQUIRED;
  } else if (
    !/(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g.test(values.password)
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    errors.password = PASSWORD_CHECK_ERROR;
  }

  if (!values.passwordRepeat) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    errors.passwordRepeat = REQUIRED;
  } else if (values.passwordRepeat !== values.password) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    errors.passwordRepeat = PASSWORD_MATCH;
  }

  return errors;
};
