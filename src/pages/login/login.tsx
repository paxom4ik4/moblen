import { FC, MouseEvent, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { Input } from "common/input/input.tsx";

import CheckIcon from "assets/icons/check-icon.svg";
import VKIcon from "assets/icons/vk-icon.svg";
import { Typography } from "common/typography/typography.tsx";
import { LoginModes } from "constants/appTypes.ts";

import './login.scss';
import { loginUser } from "services/login/login.ts";
import { useDispatch } from "react-redux";
import { setAppMode } from "store/app-mode/app-mode.slice.ts";
import { setUser } from "store/user-data/user-data.slice.ts";
import {remapStudentData, remapTutorData} from "./utils.ts";

const DEFAULT_CLASSNAME = 'login';

export const LoginPage: FC = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [mode, setMode]
    = useState<LoginModes.login | LoginModes.passwordReset>(LoginModes.login)

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

  const loginHandler = async (values: { login: string; password: string }) => {
    try {
      const res = await loginUser(values);
      const { status, role, user } = res;
      if (status === "AUTHORIZED") {
        if (role === "tutor") {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const tutorData = remapTutorData(user);

          dispatch(setUser(tutorData))
          dispatch(setAppMode(role));
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const studentData = remapStudentData(user);

          dispatch(setUser(studentData))
          dispatch(setAppMode(role));
        }

        navigate('/');
      }


    } catch (error) {
      form.resetForm({
        values: { login: '', password: '' },
        errors: { password: 'Проверьте логин и пароль' },
      });
    }
  }

  const form = useFormik({
    initialValues: { login: "", password: "" },
    onSubmit: values => {
      mode === LoginModes.login && loginHandler(values)
    },
    validate: values => {
      const errors = {};

      if (!values.login) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        errors.login = 'Обязательное поле';
      }
      if (!values.password) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        errors.password = 'Обязательное поле';
      }

      return errors;
    }
  })

  const handleVKLogin = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }

  return (
    <div className={DEFAULT_CLASSNAME}>
      <form className={`${DEFAULT_CLASSNAME}_form`} onSubmit={form.handleSubmit}>
        <Typography className={`${DEFAULT_CLASSNAME}_form_title`}>{mode === LoginModes.login ? "Вход" : "Восстановить пароль"}</Typography>

        <Input onChange={form.handleChange} onBlur={form.handleBlur} value={form.values.login} label={'Логин'} type="login" name="login" />
        <div className={`${DEFAULT_CLASSNAME}_form_error_filed`}>{form.errors.login}</div>
        <Input onChange={form.handleChange} onBlur={form.handleBlur} value={form.values.password} label={'Пароль'} type="password" name="password" />
        <div className={`${DEFAULT_CLASSNAME}_form_error_filed`}>{form.errors.password}</div>

        <div className={`${DEFAULT_CLASSNAME}_footer`}>
          <div className={`${DEFAULT_CLASSNAME}_footer_options`}>
            {mode === LoginModes.login &&
                <>
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
          </div>
          <div className={`${DEFAULT_CLASSNAME}_footer_buttons`}>
            <button className={`${DEFAULT_CLASSNAME}_form_vk`} onClick={handleVKLogin}>
              <VKIcon />
            </button>
            <button className={`${DEFAULT_CLASSNAME}_form_submit`} type="submit">
              <CheckIcon />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
