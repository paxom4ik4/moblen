import { FC, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Input } from 'common/input/input.tsx';
import CheckIcon from 'assets/icons/check-icon.svg';
import { Typography } from 'common/typography/typography.tsx';
import { loginAfterRegister, validateFn } from './utils.ts';

import './registration.scss';
import {
  createNewStudent,
  createNewStudentWithRef,
  createNewTutor,
  createNewOrg,
} from 'services/registration/registration.ts';
import {postOrgMember} from 'services/org/org.ts'
import { useNavigate, useParams } from 'react-router-dom';
import { LoginRoutes, PLATFORM_ROUTE, TutorRoutes } from 'constants/routes.ts';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { AxiosError } from 'axios';
import { Helmet } from 'react-helmet';
import { Button } from '../../common/button/button.tsx';

const DEFAULT_CLASSNAME = 'registration';

// const MOBLEN_PROMO = 'moblen2024';

export interface RegistrationValues {
  title?: string;
  name: string;
  surname: string;
  login: string;
  password: string;
  passwordRepeat: string;
  referralLink?: string;
  promo?: string;
}

type TypeEntityRegister = 'tutor' | 'org' | 'student';

export const RegistrationPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const [entityRegister, setEntityRegister] = useState<TypeEntityRegister>('org');

  // const [isOrgRegister] = useState<boolean>(entityRegister === 'org' ? true : false);

  const changeModeHandler = (value: TypeEntityRegister) => {
    setEntityRegister(value);
  };

  const handleLoginStudentWithRef = () =>
    navigate(params.groupId ? `${LoginRoutes.LOGIN}/ref/${params.groupId}` : LoginRoutes.LOGIN);

    const joinOrgMutation = useMutation(
      (data: {ref: string }) => postOrgMember(data),
      {
        onSuccess: () => {
          navigate(TutorRoutes.ASSIGNMENTS);
        },
      },
    );


  useEffect(() => {
    if (params.groupId && location.pathname.includes('joinOrg')) {
      changeModeHandler('tutor');
      // console.log(location.pathname.split('/joinOrg/')[1])
      joinOrgMutation.mutate({
        ref: location.pathname.split('/joinOrg/')[1],
      });
    } else {
      changeModeHandler('student');
    }
  }, [params.groupId]);

  const handleStudentRegister = async (values: RegistrationValues) => {

    if (location.pathname.includes('registerGroup')) {
      const { groupId } = params;

      await createStudentWithRefMutation({ ...values, referral: groupId! });
    } else {
      await createStudentMutation(values);
    }
  };
  const InitValues =
    entityRegister === 'org'
      ? {
          title: '',
          name: '',
          surname: '',
          login: '',
          password: '',
          passwordRepeat: '',
          promo: '',
        }
      : {
          name: '',
          surname: '',
          login: '',
          password: '',
          passwordRepeat: '',
        };
  const registerForm = useFormik({
    initialValues: InitValues,
    onSubmit: (values) =>
      entityRegister === 'org'
        ? handleOrgRegister(values)
        : entityRegister === 'tutor'
          ? handleTutorRegister(values)
          : handleStudentRegister(values),
    validate: (values) => validateFn(values),
  });

  const createNewTutorMutation = useMutation(
    (data: { name: string; surname: string; login: string; password: string; reflink?: string }) =>
      createNewTutor(data),
    {
      onSuccess: async () => {
        await loginAfterRegister(registerForm.values, dispatch);
        registerForm.resetForm();
      },
      onError: (error: AxiosError) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if ('USER_WITH_THIS_LOGIN_ALREADY_EXISTS' === error?.response?.data?.status) {
          registerForm.resetForm({
            values: {
              login: '',
              password: '',
              passwordRepeat: '',
              surname: registerForm.values.surname,
              name: registerForm.values.name,
            },
            errors: { passwordRepeat: 'Пользователь с таким логином уже существует' },
          });
        }
      },
    },
  );

  const { isLoading, mutateAsync: createStudentMutation } = useMutation(
    (data: { name: string; surname: string; login: string; password: string }) =>
      createNewStudent(data),
    {
      onSuccess: async () => {
        await loginAfterRegister(registerForm.values, dispatch);
        registerForm.resetForm();
      },
    },
  );

  const { isLoading: isRefLoading, mutateAsync: createStudentWithRefMutation } = useMutation(
    (data: { name: string; surname: string; login: string; password: string; referral: string }) =>
      createNewStudentWithRef(data),
    {
      onSuccess: async () => {
        await loginAfterRegister(registerForm.values, dispatch);
        registerForm.resetForm();
      },
    },
  );

  const { isLoading: isOrgLoading, mutateAsync: createOrgMutation } = useMutation(
    (data: {
      title?: string;
      name: string;
      surname: string;
      login: string;
      password: string;
      promo?: string;
    }) => createNewOrg(data),
    {
      onSuccess: async () => {
        await loginAfterRegister(registerForm.values, dispatch);
        registerForm.resetForm();
      },
    },
  );

  const handleTutorRegister = async (values: RegistrationValues) => {
    const tutorRefLink = location.pathname.split('/');
    const refLink = location.pathname.includes('joinOrg') && tutorRefLink[tutorRefLink.length - 1];

    if (refLink) {
      await createNewTutorMutation.mutate({ ...values, reflink: refLink });
    } else {
      await createNewTutorMutation.mutate(values);
    }
  };
  const handleOrgRegister = async (values: RegistrationValues) => {
    // if (values.promo !== MOBLEN_PROMO) {
      registerForm.resetForm({
        values: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          title: registerForm.values.title,
          name: registerForm.values.name,
          surname: registerForm.values.surname,
          login: registerForm.values.login,
          password: registerForm.values.password,
          passwordRepeat: registerForm.values.passwordRepeat,
          promo: '',
        },
        // errors: { promo: 'Введен неверный промокод' },
      });
    // } else {
      await createOrgMutation(values);
    // }
  };

  return (
    <div className={DEFAULT_CLASSNAME}>
      <Helmet>
        <title>Moblen - Регистрация</title>
        <meta
          property="og:title"
          content="Присоединяйтесь к Moblen. Образовательный ассистент для педагогов нового поколения."
        />
      </Helmet>

      <form className={`${DEFAULT_CLASSNAME}_form`} onSubmit={registerForm.handleSubmit}>
        <Button
          onClick={() => navigate(PLATFORM_ROUTE)}
          type="button"
          textColor={'whiteText'}
          className={`${DEFAULT_CLASSNAME}_main_button`}
          color="primary"
          title={'Перейти на главную страницу'}
        />

        <Typography className={`${DEFAULT_CLASSNAME}_form_title`}>
          Регистрация{' '}
          {entityRegister === 'org'
            ? 'организации'
            : entityRegister === 'tutor'
              ? 'преподавателя'
              : 'ученика'}
        </Typography>
        {entityRegister === 'org' ? (
          <>
            <Input
              onBlur={registerForm.handleBlur}
              onChange={registerForm.handleChange}
              value={registerForm.values.title}
              label={'Название'}
              type="title"
              name="title"
            />
            <div className={`${DEFAULT_CLASSNAME}_form_error_filed`}>
              {registerForm.errors.title}
            </div>
          </>
        ) : (
          <></>
        )}
        <Input
          onBlur={registerForm.handleBlur}
          onChange={registerForm.handleChange}
          value={registerForm.values.name}
          label={'Имя'}
          type="name"
          name="name"
        />
        <div className={`${DEFAULT_CLASSNAME}_form_error_filed`}>{registerForm.errors.name}</div>
        <Input
          onBlur={registerForm.handleBlur}
          onChange={registerForm.handleChange}
          value={registerForm.values.surname}
          label={'Фамилия'}
          type="surname"
          name="surname"
        />
        <div className={`${DEFAULT_CLASSNAME}_form_error_filed`}>{registerForm.errors.surname}</div>
        <Input
          onBlur={registerForm.handleBlur}
          onChange={registerForm.handleChange}
          value={registerForm.values.login}
          placeholder={'Email'}
          label={'Почта'}
          type="login"
          name="login"
        />
        <div className={`${DEFAULT_CLASSNAME}_form_error_filed`}>{registerForm.errors.login}</div>
        <Input
          onBlur={registerForm.handleBlur}
          onChange={registerForm.handleChange}
          value={registerForm.values.password}
          label={'Пароль'}
          type="password"
          name="password"
        />
        <div className={`${DEFAULT_CLASSNAME}_form_error_filed`}>
          {registerForm.errors.password}
        </div>
        <Input
          onBlur={registerForm.handleBlur}
          onChange={registerForm.handleChange}
          value={registerForm.values.passwordRepeat}
          label={'Повторите пароль'}
          type="password"
          name="passwordRepeat"
        />

        <div className={`${DEFAULT_CLASSNAME}_form_error_filed`}>
          {registerForm.errors.passwordRepeat}
        </div>

        {entityRegister === 'org' && (
          <>
            <Input
              label={'Промокод'}
              value={registerForm.values.promo}
              onChange={registerForm.handleChange}
              type="text"
              name="promo"
            />
            {/* <div className={`${DEFAULT_CLASSNAME}_form_error_filed`}>
              {registerForm.errors.promo}
            </div> */}
          </>
        )}

        <div className={`${DEFAULT_CLASSNAME}_footer`}>
          <div className={`${DEFAULT_CLASSNAME}_footer_buttons`}>
            <Typography
              color={'purple'}
              weight={'bold'}
              className={`${DEFAULT_CLASSNAME}_footer_mode`}>
              <Typography onClick={handleLoginStudentWithRef} color={'default'}>Есть аккаунт?</Typography>
              <span
                onClick={() =>
                  navigate(
                    params?.groupId
                      ? `/joinGroup/${params?.groupId}`
                      : LoginRoutes.LOGIN,
                  )
                }
                color={'purple'}>
                Войти
              </span>
            </Typography>
            {!location.pathname.includes('registerGroup') && (
              <>
                <Typography
                  onClick={() => {
                    const value =
                      entityRegister === 'org'
                        ? 'tutor'
                        : entityRegister === 'student'
                          ? 'tutor'
                          : 'org';
                    return changeModeHandler(value);
                  }}
                  color={'purple'}
                  className={`${DEFAULT_CLASSNAME}_footer_mode`}>
                  Регистрация{' '}
                  {entityRegister === 'org'
                    ? 'преподавателя'
                    : entityRegister === 'student'
                      ? 'преподавателя'
                      : 'организации'}
                </Typography>
                <Typography
                  onClick={() => {
                    const value =
                      entityRegister == 'org'
                        ? 'student'
                        : entityRegister == 'tutor'
                          ? 'student'
                          : 'org';
                    return changeModeHandler(value);
                  }}
                  color={'purple'}
                  className={`${DEFAULT_CLASSNAME}_footer_mode`}>
                  Регистрация{' '}
                  {entityRegister === 'org'
                    ? 'ученика'
                    : entityRegister === 'tutor'
                      ? 'ученика'
                      : 'организации'}
                </Typography>
              </>
            )}
          </div>

          {isLoading || isRefLoading || isOrgLoading ? (
            <CircularProgress sx={{ color: '#c8caff' }} />
          ) : (
            <button className={`${DEFAULT_CLASSNAME}_form_submit`} type={'submit'}>
              <CheckIcon />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
