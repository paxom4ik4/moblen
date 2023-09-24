import { Dispatch, FC, SetStateAction, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage } from 'formik';
import { Input } from "common/input/input.tsx";

import CheckIcon from "assets/icons/check-icon.svg";
import { Typography } from "common/typography/typography.tsx";
import { AppModes, LoginModes } from "constants/appTypes.ts";

import './login.scss';

const DEFAULT_CLASSNAME = 'login';

interface LoginProps {
  setUserData: Dispatch<SetStateAction<{ user: AppModes.student} | { user: AppModes.tutor } | null>>;
}

export const LoginPage: FC<LoginProps> = props => {
  const navigate = useNavigate();

  const { setUserData } = props;

  const [mode, setMode]
    = useState<LoginModes.login | LoginModes.passwordReset>(LoginModes.login);

  const loginConfig = {
    login: '',
    password: '',
    passwordRepeat: '',
  }

  const passwordResetConfig = {
    login: '',
    password: '',
    passwordRepeat: '',
  }

  const loginContent = (
    <>
      <Input label={'Логин'} type="login" name="login" />
      <ErrorMessage className={`${DEFAULT_CLASSNAME}_form_error_filed`} name="login" component="div" />
      <Input label={'Пароль'} type="password" name="password" />
      <ErrorMessage className={`${DEFAULT_CLASSNAME}_form_error_filed`} name="password" component="div" />
    </>
  )

  const passwordResetContent = (
    <>
      <Input label={'Логин'} type="login" name="login" />
      <ErrorMessage className={`${DEFAULT_CLASSNAME}_form_error_filed`} name="login" component="div" />
      <Input label={'Новый пароль'} type="password" name="password" />
      <ErrorMessage className={`${DEFAULT_CLASSNAME}_form_error_filed`} name="password" component="div" />
      <Input label={'Повторите новый пароль'} type="passwordRepeat" name="passwordRepeat" />
      <ErrorMessage className={`${DEFAULT_CLASSNAME}_form_error_filed`} name="passwordRepeat" component="div" />
    </>
  );

  const loginHandler = () => {
    setUserData({ user: AppModes.student });
    navigate('/');
  }

  return (
    <div className={DEFAULT_CLASSNAME}>
      <Formik
        initialValues={mode === LoginModes.login ? loginConfig : passwordResetConfig}
        validate={values => {
          const errors = mode === LoginModes.login ? loginConfig : passwordResetConfig;
          if (!values.login) {
            errors.login = 'Обязательное поле';
          }
          if (!values.password) {
            errors.password = 'Обязательное поле';
          }
          if (mode === 'passwordReset' && !values?.passwordRepeat) {
            errors.passwordRepeat = 'Обязательное поле';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form className={`${DEFAULT_CLASSNAME}_form`} onSubmit={loginHandler}>
            <Typography className={`${DEFAULT_CLASSNAME}_form_title`}>{mode === LoginModes.login ? "Вход" : "Восстановить пароль"}</Typography>

            {mode === LoginModes.login ? loginContent : passwordResetContent}

            <div className={`${DEFAULT_CLASSNAME}_footer`}>
              {mode === LoginModes.login && <>
                  <Typography
                      onClick={() => navigate('/registration')}
                      color={'purple'}
                      className={`${DEFAULT_CLASSNAME}_footer_mode`}>
                      Зарегистрироваться
                  </Typography>

                  <Typography
                      onClick={() => setMode(LoginModes.passwordReset)}
                      color={'purple'}
                      className={`${DEFAULT_CLASSNAME}_footer_mode`}>
                      Восстановить пароль
                  </Typography>
              </>
              }
              <button className={`${DEFAULT_CLASSNAME}_form_submit`} type="submit" disabled={isSubmitting}>
                <CheckIcon />
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
