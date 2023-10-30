import { FC, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Input } from 'common/input/input.tsx';
import CheckIcon from 'assets/icons/check-icon.svg';
import { Typography } from 'common/typography/typography.tsx';
import { validateFn } from './utils.ts';

import './registration.scss';
import {
  createNewStudent,
  createNewStudentWithRef,
  createNewTutor,
} from 'services/registration/registration.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginRoutes } from 'constants/routes.ts';
import { GROUP_REF_LINK } from 'constants/api.ts';

const DEFAULT_CLASSNAME = 'registration';

export interface RegistrationValues {
  name: string;
  surname: string;
  login: string;
  password: string;
  passwordRepeat: string;
  referralLink?: string;
}

export const RegistrationPage: FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [isTutorRegister, setIsTutorRegister] = useState<boolean>(true);
  const changeModeHandler = () => setIsTutorRegister(!isTutorRegister);

  const handleTutorRegister = async (values: RegistrationValues) => {
    const res = await createNewTutor(values);

    if ('tutor_uuid' in res) {
      navigate(LoginRoutes.LOGIN);
    }
  };

  const handleLoginStudentWithRef = () =>
    navigate(params.groupId ? `${LoginRoutes.LOGIN}/ref/${params.groupId}` : LoginRoutes.LOGIN);

  useEffect(() => {
    params.groupId && setIsTutorRegister(false);
  }, [params.groupId]);

  const handleStudentRegister = async (values: RegistrationValues) => {
    if (location.pathname.includes('ref')) {
      const { groupId } = params;

      const referralLink = `${GROUP_REF_LINK}${groupId}`;

      const res = await createNewStudentWithRef({ ...values, referralLink });
      if (res.status === 'SUCCESSFULLY_ADDED') {
        navigate(LoginRoutes.LOGIN);
      }
    } else {
      const res = await createNewStudent(values);
      if ('student_uuid' in res) {
        navigate(LoginRoutes.LOGIN);
      }
    }
  };

  const registerFrom = useFormik({
    initialValues: {
      name: '',
      surname: '',
      login: '',
      password: '',
      passwordRepeat: '',
    },
    onSubmit: (values) =>
      isTutorRegister ? handleTutorRegister(values) : handleStudentRegister(values),
    validate: (values) => validateFn(values),
  });

  return (
    <div className={DEFAULT_CLASSNAME}>
      <form className={`${DEFAULT_CLASSNAME}_form`} onSubmit={registerFrom.handleSubmit}>
        <Typography className={`${DEFAULT_CLASSNAME}_form_title`}>
          Регистрация {isTutorRegister ? 'преподавателя' : 'ученика'}
        </Typography>

        <Input
          onBlur={registerFrom.handleBlur}
          onChange={registerFrom.handleChange}
          value={registerFrom.values.name}
          label={'Имя'}
          type="name"
          name="name"
        />
        <div className={`${DEFAULT_CLASSNAME}_form_error_filed`}>{registerFrom.errors.name}</div>
        <Input
          onBlur={registerFrom.handleBlur}
          onChange={registerFrom.handleChange}
          value={registerFrom.values.surname}
          label={'Фамилия'}
          type="surname"
          name="surname"
        />
        <div className={`${DEFAULT_CLASSNAME}_form_error_filed`}>{registerFrom.errors.surname}</div>
        <Input
          onBlur={registerFrom.handleBlur}
          onChange={registerFrom.handleChange}
          value={registerFrom.values.login}
          placeholder={'Email или телефон'}
          label={'Логин'}
          type="login"
          name="login"
        />
        <div className={`${DEFAULT_CLASSNAME}_form_error_filed`}>{registerFrom.errors.login}</div>
        <Input
          onBlur={registerFrom.handleBlur}
          onChange={registerFrom.handleChange}
          value={registerFrom.values.password}
          label={'Пароль'}
          type="password"
          name="password"
        />
        <div className={`${DEFAULT_CLASSNAME}_form_error_filed`}>
          {registerFrom.errors.password}
        </div>
        <Input
          onBlur={registerFrom.handleBlur}
          onChange={registerFrom.handleChange}
          value={registerFrom.values.passwordRepeat}
          label={'Повторите пароль'}
          type="password"
          name="passwordRepeat"
        />
        <div className={`${DEFAULT_CLASSNAME}_form_error_filed`}>
          {registerFrom.errors.passwordRepeat}
        </div>
        <div className={`${DEFAULT_CLASSNAME}_footer`}>
          <div className={`${DEFAULT_CLASSNAME}_footer_buttons`}>
            <Typography
              onClick={handleLoginStudentWithRef}
              color={'purple'}
              weight={'bold'}
              className={`${DEFAULT_CLASSNAME}_footer_mode`}>
              <Typography color={'default'}>Есть аккаунт?</Typography> Войти
            </Typography>
            <Typography
              onClick={changeModeHandler}
              color={'purple'}
              className={`${DEFAULT_CLASSNAME}_footer_mode`}>
              Регистрация {isTutorRegister ? 'ученика' : 'преподавателя'}
            </Typography>
          </div>
          <button className={`${DEFAULT_CLASSNAME}_form_submit`} type={'submit'}>
            <CheckIcon />
          </button>
        </div>
      </form>
    </div>
  );
};
