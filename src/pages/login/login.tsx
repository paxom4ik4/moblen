import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { Input } from 'common/input/input.tsx';

import CheckIcon from 'assets/icons/check-icon.svg';
import { Typography } from 'common/typography/typography.tsx';
import { LoginModes } from 'constants/appTypes.ts';

import './login.scss';
import { loginUser } from 'services/login/login.ts';
import { useDispatch, batch } from 'react-redux';
import { setAppMode } from 'store/app-mode/app-mode.slice.ts';
import { setUser } from 'store/user-data/user-data.slice.ts';
import { handleDataStoring } from './utils.ts';
import { LoginRoutes, PLATFORM_ROUTE, TutorRoutes } from 'constants/routes.ts';
import { useMutation } from 'react-query';
import { CircularProgress } from '@mui/material';
import { Helmet } from 'react-helmet';
import { Button } from '../../common/button/button.tsx';

const DEFAULT_CLASSNAME = 'login';

interface LoginErrors {
  login: string;
  password: string;
  passwordRepeat: string;
}

export const LoginPage: FC = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const params = useParams();

  const [mode] = useState<LoginModes.login | LoginModes.passwordReset>(LoginModes.login);

  const { isLoading, mutateAsync: loginUserMutation } = useMutation(
    (data: { login: string; password: string; referral?: string }) => loginUser(data),
    {
      onSuccess: () => {
        navigate(TutorRoutes.ASSIGNMENTS);
      },
      onError: () => {
        form.resetForm({
          values: { login: '', password: '' },
          errors: { password: 'Проверьте логин и пароль' },
        });
      },
    },
  );

  const loginHandler = async (values: { login: string; password: string }) => {
    const loginValues = params?.groupId
      ? {
          ...values,
          referral: params.groupId,
        }
      : values;

    try {
      const loginData = await loginUserMutation(loginValues);

      const { status, user, token } = await loginData;

      if (status === 'AUTHORIZED') {
        localStorage.setItem('accessToken', token.access_token);
        localStorage.setItem('refreshToken', token.refresh_token);
        localStorage.setItem('expiresIn', String(Date.now() + Number(`${token.expires_in}000`)));

        if (user.role === 'TT') {
          batch(() => {
            dispatch(setUser(user));
            dispatch(setAppMode(user.role));
          });

          handleDataStoring(user, user.role);
        } else {
          batch(() => {
            dispatch(setUser(user));
            dispatch(setAppMode(user.role));
          });

          handleDataStoring(user, user.role);
        }
      }
    } catch (error) {
      console.info('Error while authorization');
    }
  };

  const form = useFormik({
    initialValues: { login: '', password: '' },
    onSubmit: (values) => {
      mode === LoginModes.login && loginHandler(values);
    },
    validate: (values) => {
      const errors: Partial<LoginErrors> = {};

      if (!values.login) {
        errors.login = 'Обязательное поле';
      }
      if (!values.password) {
        errors.password = 'Обязательное поле';
      }

      return errors;
    },
  });

  return (
    <div className={DEFAULT_CLASSNAME}>
      <Helmet>
        <title>Moblen - Войти</title>
        <meta property="og:title" content="Войдите в свой аккаунт Moblen." />
      </Helmet>

      <form className={`${DEFAULT_CLASSNAME}_form`} onSubmit={form.handleSubmit}>
        <Button
          onClick={() => navigate(PLATFORM_ROUTE)}
          type="button"
          textColor={'whiteText'}
          className={`${DEFAULT_CLASSNAME}_main_button`}
          color="primary"
          title={'Перейти на главную страницу'}
        />

        <Typography className={`${DEFAULT_CLASSNAME}_form_title`}>
          {mode === LoginModes.login ? 'Вход' : 'Восстановить пароль'}
        </Typography>

        <Input
          autoComplete={'false'}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          value={form.values.login}
          label={'Почта'}
          type="login"
          name="login"
        />
        <div className={`${DEFAULT_CLASSNAME}_form_error_filed`}>{form.errors.login}</div>
        <Input
          autoComplete={'false'}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          value={form.values.password}
          label={'Пароль'}
          type="password"
          name="password"
        />
        <div className={`${DEFAULT_CLASSNAME}_form_error_filed`}>{form.errors.password}</div>

        <div className={`${DEFAULT_CLASSNAME}_footer`}>
          <div className={`${DEFAULT_CLASSNAME}_footer_options`}>
            {mode === LoginModes.login && (
              <>
                <Typography className={`${DEFAULT_CLASSNAME}_footer_mode`}>
                  Нет аккаунта?{' '}
                  <span
                    onClick={() =>
                      navigate(
                        params?.groupId
                          ? `/registerGroup/${params?.groupId}`
                          : LoginRoutes.REGISTRATION,
                      )
                    }
                    color={'purple'}>
                    Зарегистрироваться
                  </span>
                </Typography>
              </>
            )}
          </div>
          <div className={`${DEFAULT_CLASSNAME}_footer_buttons`}>
            {isLoading ? (
              <CircularProgress sx={{ color: '#c8caff' }} />
            ) : (
              <button className={`${DEFAULT_CLASSNAME}_form_submit`} type="submit">
                <CheckIcon />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
