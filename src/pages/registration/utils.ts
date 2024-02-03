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
const WRONG_PHONE_FORMAT = 'Неверный формат телефона';
// const PASSWORD_CHECK_ERROR = 'Минимум 8 символов, содержащий цифру';

export const validateFn = (values: RegistrationValues, isTutorRegister: boolean) => {
  const errors: Partial<RegistrationValues> = {};
  if (!values.login) {
    errors.login = REQUIRED;
  } else if (
    /\D/.test(values.login) &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.login)
  ) {
    errors.login = WRONG_MAIL_FORMAT;
  } else if (!/\D/.test(values.login) && values.login.length < 11) {
    errors.login = WRONG_PHONE_FORMAT;
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

  // if (!values.password) {
  //   errors.password = REQUIRED;
  // } else if (!/(?=.*[0-9])(?=.*[a-z])[0-9a-zA-Z!@#$%^&*]{8,}/g.test(values.password)) {
  //   errors.password = PASSWORD_CHECK_ERROR;
  // }

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
console.log(status)
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
    } else if (user.role === AppModes.ST) {
      batch(() => {
        dispatch(setUser(user));
        dispatch(setAppMode(AppModes.ST));
      });

      handleDataStoring(user, AppModes.ST);
    } else {
      batch(() => {
        dispatch(setUser(user));
        dispatch(setAppMode(AppModes.ORG));
      })
    }
  }
};
