import { RegistrationValues } from './registration.tsx';
import { loginUser } from '../../services/login/login.ts';
import { handleDataStoring, remapStudentData, remapTutorData } from '../login/utils.ts';
import { batch } from 'react-redux';
import { setUser } from '../../store/user-data/user-data.slice.ts';
import { setAppMode } from '../../store/app-mode/app-mode.slice.ts';
import { Dispatch } from 'react';
import { Action } from '@reduxjs/toolkit';

const REQUIRED = 'Обязательное поле';
const PASSWORD_MATCH = 'Пароли несовпадают';
const WRONG_MAIL_FORMAT = 'Неверный формат Email';
const WRONG_PHONE_FORMAT = 'Неверный формат телефона';
const PASSWORD_CHECK_ERROR = 'Минимум 8 символов, cпецсимвол, верхний регистр';

export const validateFn = (values: RegistrationValues) => {
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

  if (!values.password) {
    errors.password = REQUIRED;
  } else if (
    !/(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g.test(values.password)
  ) {
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
  const { status, role, user, token } = res;
  if (status === 'AUTHORIZED') {
    localStorage.setItem('accessToken', token.access_token);
    localStorage.setItem('refreshToken', token.refresh_token);
    localStorage.setItem('expiresIn', String(Date.now() + Number(`${token.expires_in}000`)));

    if (role === 'tutor') {
      const tutorData = remapTutorData(user);

      batch(() => {
        dispatch(setUser(tutorData));
        dispatch(setAppMode(role));
      });

      handleDataStoring(tutorData, role);
    } else {
      const studentData = remapStudentData(user);

      batch(() => {
        dispatch(setUser(studentData));
        dispatch(setAppMode(role));
      });

      handleDataStoring(studentData, role);
    }
  }
};
