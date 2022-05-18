import React from 'react';
import { Formik, FormikHelpers } from 'formik';
import { Link, useHistory } from 'react-router-dom';
import { Button } from '../../../../shared/Form/Button/Button';
import { Input } from '../../../../shared/Form/Input/Input';
import { Loader } from '../../../../shared/Form/Loader/Loader';
import {
  ChangePasswordData,
  User,
} from '../../../../store/ducks/user/contracts/state';

import s from './EditPassword.module.scss';
import { validationSchema } from './validationSchema';
import { eventBus, EventTypes } from '../../../../services/EventBus';
import { NotificationButtons } from './NotificationButtons';
import { NotificationType } from '../../../../components/GlobalNotifications/GlobalNotifications';

interface Props {
  user: User | undefined;
  loader: boolean;
  logout: () => void;
  onSubmit: (
    values: ChangePasswordData,
    options: FormikHelpers<ChangePasswordData>,
  ) => void;
}

export const EditPassword = ({ loader, onSubmit, user, logout }: Props) => {
  function isDisabled(isValid: boolean, dirty: boolean) {
    return (!isValid && !dirty) || loader;
  }

  const history = useHistory();

  function onDiscard() {
    eventBus.emit(EventTypes.removeNotification, 'logout-notification');
  }

  function onConfirm() {
    logout();
    history.push(`/forgot-password?email=${user?.email || ''}`);
  }

  function showLogoutConfirmation() {
    eventBus.emit(EventTypes.notification, {
      title: 'Для восстановления пароля будет выполнен выход из аккаунта',
      message: (
        <NotificationButtons onDiscard={onDiscard} onConfirm={onConfirm} />
      ),
      type: NotificationType.WARNING,
      dismiss: undefined,
      id: 'logout-notification',
    });
  }

  return (
    <div className={s.edit__password}>
      <Formik
        initialValues={{
          currentPassword: '',
          password: '',
          verificationPassword: '',
        }}
        validateOnBlur
        onSubmit={(
          values: ChangePasswordData,
          options: FormikHelpers<ChangePasswordData>,
        ) => onSubmit(values, options)}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isValid,
          handleSubmit,
          dirty,
        }) => (
          <div className={s.form}>
            <div className={s.input__wrapper}>
              <Link
                to="#"
                onClick={showLogoutConfirmation}
                className={s.forgot}
              >
                Восстановить
              </Link>

              <Input
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Старый пароль"
                name="currentPassword"
                value={values.currentPassword}
                type="password"
                options={{
                  touched,
                  errors,
                  classes: { [s.input__currentPassword]: true },
                }}
              />
            </div>

            <div className={s.input__wrapper}>
              <Input
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Новый пароль"
                name="password"
                autoComplete="new-password"
                value={values.password}
                type="password"
                options={{
                  touched,
                  errors,
                }}
              />
            </div>

            <div className={s.input__wrapper}>
              <Input
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Повторите пароль"
                name="verificationPassword"
                value={values.verificationPassword}
                type="password"
                options={{
                  touched,
                  errors,
                }}
              />
            </div>

            <div className={s.button__wrapper}>
              <Button
                disabled={isDisabled(isValid, dirty)}
                type="submit"
                onClick={() => handleSubmit()}
                options={{
                  content: loader ? <Loader /> : 'Сохранить',
                  setDisabledStyle: isDisabled(isValid, dirty),
                }}
              />

              <Link to="/profile">
                <Button
                  options={{
                    classes: { discard: true },
                    content: 'Отмена',
                  }}
                />
              </Link>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};
