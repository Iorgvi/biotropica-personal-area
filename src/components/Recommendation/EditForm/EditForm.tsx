import React from 'react';
import classNames from 'classnames';
import { Formik } from 'formik';
import Button from '../../Button/Button';
import { HtmlEditor } from '../../HtmlEditor/HtmlEditor';

import validationSchema from './validationSchema';
import s from './EditForm.module.scss';
import { Input } from '../../../shared/Form/Input/Input';

export type RecommendationForm = {
  title: string;
  description: string;
};

export type Props = {
  defaultValues: RecommendationForm;
  onSave(data: RecommendationForm): void;
  onClose(): void;
};

export function RecommendationEditForm({
  defaultValues,
  onSave,
  onClose,
}: Props) {
  return (
    <Formik
      enableReinitialize
      initialValues={defaultValues}
      onSubmit={onSave}
      validationSchema={validationSchema}
    >
      {({ values, handleSubmit, handleBlur, handleChange, setFieldValue }) => (
        <form className={s.recommendationForm} onSubmit={e => handleSubmit(e)}>
          <div className={s.line}>
            <Input
              name="title"
              type="text"
              label="Название"
              placeholder="Введите название"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
            />
          </div>
          <div className={s.line}>
            <div className={s.title}>Описание</div>
            <HtmlEditor
              value={values.description}
              onChange={value => {
                handleChange(value);
                setFieldValue('description', value);
              }}
              config={{
                formats: [],
              }}
            />
          </div>
          <div className={s.buttons}>
            <Button type="submit" isPrimary={true}>
              Сохранить
            </Button>
            <Button onClick={onClose}>Отмена</Button>
          </div>
        </form>
      )}
    </Formik>
  );
}
