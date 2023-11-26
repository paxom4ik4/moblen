import { FC, MouseEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { Input } from 'common/input/input.tsx';

import CheckIcon from 'assets/icons/check-icon.svg';
import VKIcon from 'assets/icons/vk-icon.svg';
import { Typography } from 'common/typography/typography.tsx';
import { LoginModes } from 'constants/appTypes.ts';

import './login.scss';
import { loginUser } from 'services/login/login.ts';
import { useDispatch, batch } from 'react-redux';
import { setAppMode } from 'store/app-mode/app-mode.slice.ts';
import { setUser } from 'store/user-data/user-data.slice.ts';
import { handleDataStoring, remapStudentData, remapTutorData } from './utils.ts';
import { LoginRoutes, TutorRoutes } from 'constants/routes.ts';
import { GROUP_REF_LINK } from 'constants/api.ts';
import { useMutation } from 'react-query';
import { CircularProgress } from '@mui/material';

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

  // const passwordResetContent = (
  //   <>
  //     <Input label={'Логин'} type="login" name="login" />
  //     <ErrorMessage className={`${DEFAULT_CLASSNAME}_form_error_filed`} name="login" component="div" />
  //     <Input label={'Новый пароль'} type="password" name="password" />
  //     <ErrorMessage className={`${DEFAULT_CLASSNAME}_form_error_filed`} name="password" component="div" />
  //     <Input label={'Повторите новый пароль'} type="passwordRepeat" name="passwordRepeat" />
  //     <ErrorMessage className={`${DEFAULT_CLASSNAME}_form_error_filed`} name="passwordRepeat" component="div" />
  //   </>
  // );

  const { isLoading, mutateAsync: loginUserMutation } = useMutation(
    (data: { login: string; password: string; referral_link?: string }) => loginUser(data),
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
      ? { ...values, referral_link: `${GROUP_REF_LINK}${params.groupId}` }
      : values;

    try {
      const loginData = await loginUserMutation(loginValues);

      const { status, role, user, token } = await loginData;

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

  const handleVKLogin = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div className={DEFAULT_CLASSNAME}>
      <form className={`${DEFAULT_CLASSNAME}_form`} onSubmit={form.handleSubmit}>
        <Typography className={`${DEFAULT_CLASSNAME}_form_title`}>
          {mode === LoginModes.login ? 'Вход' : 'Восстановить пароль'}
        </Typography>

        <Input
          autoComplete={'false'}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          value={form.values.login}
          label={'Логин'}
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
                  <span onClick={() => navigate(LoginRoutes.REGISTRATION)} color={'purple'}>
                    Зарегистрироваться
                  </span>
                </Typography>

                {/*<Typography*/}
                {/*  onClick={() => setMode(LoginModes.passwordReset)}*/}
                {/*  color={'purple'}*/}
                {/*  className={`${DEFAULT_CLASSNAME}_footer_mode`}>*/}
                {/*  Восстановить пароль*/}
                {/*</Typography>*/}
              </>
            )}
          </div>
          <div className={`${DEFAULT_CLASSNAME}_footer_buttons`}>
            <button className={`${DEFAULT_CLASSNAME}_form_vk`} onClick={handleVKLogin}>
              <VKIcon />
            </button>
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
