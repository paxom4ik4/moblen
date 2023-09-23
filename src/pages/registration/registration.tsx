import { FC, useState } from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import { Input} from "common/input/input.tsx";
import CheckIcon from 'assets/icons/check-icon.svg';
import { Typography } from "common/typography/typography.tsx";
import { AppModes } from "../../constants/appTypes.ts";

import './registration.scss';

const DEFAULT_CLASSNAME = 'registration';

export const RegistrationPage: FC = () => {
  const [mode, setMode] = useState<AppModes.tutor | AppModes.student>(AppModes.tutor);

  const changeModeHandler = () => setMode(mode === AppModes.tutor ? AppModes.student : AppModes.tutor);

  return (
    <div className={DEFAULT_CLASSNAME}>
      <Formik
        initialValues={{ name: '', surname: '', login: '', password: '', passwordRepeat: '' }}
        validate={values => {
          const errors = { name: '', surname: '', login: '', password: '', passwordRepeat: '' };
          if (!values.login) {
            errors.login = 'Обязательное поле';
          }
          if (!values.name) {
            errors.name = 'Обязательное поле';
          }
          if (!values.surname) {
            errors.surname = 'Обязательное поле';
          }
          if (!values.password) {
            errors.password = 'Обязательное поле';
          }
          if (!values.passwordRepeat) {
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
          <Form className={`${DEFAULT_CLASSNAME}_form`}>
            <Typography className={`${DEFAULT_CLASSNAME}_form_title`}>Регистрация {mode === AppModes.tutor ? "преподавателя" : "ученика"}</Typography>

            <Input label={'Имя'} type="name" name="name" />
            <ErrorMessage className={`${DEFAULT_CLASSNAME}_form_error_filed`} name="name" component="div" />
            <Input label={'Фамилия'} type="surname" name="surname" />
            <ErrorMessage className={`${DEFAULT_CLASSNAME}_form_error_filed`} name="surname" component="div" />
            <Input label={'Логин'} type="login" name="login" />
            <ErrorMessage className={`${DEFAULT_CLASSNAME}_form_error_filed`} name="login" component="div" />
            <Input label={'Пароль'} type="password" name="password" />
            <ErrorMessage className={`${DEFAULT_CLASSNAME}_form_error_filed`} name="password" component="div" />
            <Input label={'Повторите пароль'} type="passwordRepeat" name="passwordRepeat" />
            <ErrorMessage className={`${DEFAULT_CLASSNAME}_form_error_filed`} name="passwordRepeat" component="div" />
            <div className={`${DEFAULT_CLASSNAME}_footer`}>
              <Typography onClick={changeModeHandler} color={'purple'} className={`${DEFAULT_CLASSNAME}_footer_mode`}>Регистрация {mode === AppModes.tutor ? "ученика" : "преподавателя"}</Typography>
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
