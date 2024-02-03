import { RegistrationValues } from './registration.tsx';
import { loginUser } from '../../services/login/login.ts';
import { handleDataStoring } from '../login/utils.ts';
import { batch } from 'react-redux';
import { setUser } from '../../store/user-data/user-data.slice.ts';
import { setAppMode } from '../../store/app-mode/app-mode.slice.ts';
import { Dispatch } from 'react';
import { Action } from '@reduxjs/toolkit';
import { AppModes } from 'constants/appTypes.ts';

const REQUIRED = 'Обязательное поле';
const PASSWORD_MATCH = 'Пароли несовпадают';
const WRONG_MAIL_FORMAT = 'Неверный формат Email';
// const WRONG_PHONE_FORMAT = 'Неверный формат телефона';
const PASSWORD_CHECK_ERROR = 'Минимум 8 символов, содержащий цифру, без кириллицы';

export const validateFn = (values: RegistrationValues, isTutorRegister: boolean) => {
  const errors: Partial<RegistrationValues> = {};
  // eslint-disable-next-line no-useless-escape
  const regMail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (!values.login) {
    errors.login = REQUIRED;
  } else {
    if (!regMail.test(values.login)) {
      errors.login = WRONG_MAIL_FORMAT;
    }
  }

  if (!values.name) {
    errors.name = REQUIRED;
  }

  if (!values.surname) {
    errors.surname = REQUIRED;
  }

  if (isTutorRegister && !values.promo) {
    errors.promo = REQUIRED;
  }

  // eslint-disable-next-line no-useless-escape
  const regPassword = /(?=.*[0-9])[0-9a-zA-Z\\!\.\/\[\]\-\=@#$%^>\,\.<&{?}~*]{8,}/g

  if (!values.password) {
    errors.password = REQUIRED;
  } else if (!regPassword.test(values.password)) {
    errors.password = PASSWORD_CHECK_ERROR;
  }

  if (!values.passwordRepeat) {
    errors.passwordRepeat = REQUIRED;
  } else if (values.passwordRepeat !== values.password) {
    errors.passwordRepeat = PASSWORD_MATCH;
  }

  return errors;
};

export const loginAfterRegister = async (
  loginValues: { login: string; password: string },
  dispatch: Dispatch<Action>,
) => {
  const res = await loginUser(loginValues);
  const { status, user, token } = res;

  if (status === 'AUTHORIZED') {
    localStorage.setItem('accessToken', token.access_token);
    localStorage.setItem('refreshToken', token.refresh_token);
    localStorage.setItem('expiresIn', String(Date.now() + Number(`${token.expires_in}000`)));

    if (user.role === AppModes.TT) {
      batch(() => {
        dispatch(setUser(user));
        dispatch(setAppMode(AppModes.TT));
      });

      handleDataStoring(user, AppModes.TT);
    } else {
      batch(() => {
        dispatch(setUser(user));
        dispatch(setAppMode(AppModes.ST));
      });

      handleDataStoring(user, AppModes.ST);
    }
  }
};
