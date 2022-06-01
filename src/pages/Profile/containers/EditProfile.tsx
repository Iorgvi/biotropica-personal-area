import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { EditProfileData } from '../../../components/EditClient/ProfileData/ProfileData';
import { NotificationType } from '../../../components/GlobalNotifications/GlobalNotifications';
import { MAX_IMAGE_SIZE } from '../../../constants/files';
import { eventBus, EventTypes } from '../../../services/EventBus';
import FileService from '../../../services/FileService';
import {
  fetchUpdateUser,
  fetchUpdateUserEmail,
  setUserResponse,
} from '../../../store/ducks/user/actionCreators';
import {
  UpdateUserData,
  User,
} from '../../../store/ducks/user/contracts/state';
import {
  selectCurrentUserData,
  selectUserLoadingStatus,
  selectUserResponse,
} from '../../../store/ducks/user/selectors';
import {
  SpecialistUpdateDto,
  useGetSpecialistQuery,
  useRequestChangeSpecialistDataMutation,
} from '../../../store/rtk/requests/specialists';
import { LoadingStatus } from '../../../store/types';
import {
  checkFileSize,
  checkFileType,
  FileType,
  uploadFiles,
} from '../../../utils/filesHelper';
import { getMediaLink } from '../../../utils/mediaHelper';

const EditProfile = () => {
  const options = [
    { value: 'Мужской', label: 'Мужской' },
    { value: 'Женский', label: 'Женский' },
  ];

  const dispatch = useDispatch();
  const loadingStatus = useSelector(selectUserLoadingStatus);
  const response = useSelector(selectUserResponse);
  const history = useHistory();

  const user: User | undefined = useSelector(selectCurrentUserData);
  const userImage = user?.profilePhoto && getMediaLink(user?.profilePhoto);
  const isSpecialist = user?.roles?.includes('SPECIALIST');
  const { data: specialist } = useGetSpecialistQuery(undefined, {
    skip: !isSpecialist,
  });

  const loader = LoadingStatus.LOADING === loadingStatus;
  const [image, setImage] = useState<string | ArrayBuffer | null>(
    userImage || '',
  );

  const [updateSpecialist] = useRequestChangeSpecialistDataMutation();

  useEffect(() => {
    if (!response) return;
    switch (loadingStatus) {
      case LoadingStatus.ERROR:
        console.log('____________________', response);
        break;
      case LoadingStatus.SUCCESS:
        eventBus.emit(EventTypes.notification, {
          title: 'Успешно!',
          message: response.message,
          type: NotificationType.SUCCESS,
        });
        dispatch(setUserResponse(undefined));
        history.push('/profile');
        break;
      default:
        break;
    }
  }, [loadingStatus, response]);

  async function onSubmit(values: UpdateUserData & SpecialistUpdateDto) {
    if (values.email && user?.email !== values.email) {
      dispatch(fetchUpdateUserEmail({ email: values.email }));
    }
    if (values.profilePhoto instanceof File) {
      const res = await FileService.upload(values.profilePhoto);
      values.profilePhoto = res.data.name;
    }
    const data: UpdateUserData = {
      ...values,
      email: user?.email,
    };
    dispatch(
      fetchUpdateUser({
        profilePhoto: values?.profilePhoto || null,
        lastname: values?.lastname,
        name: values?.name,
        email: values?.email,
        gender: values?.gender,
        patronymic: values?.patronymic,
        phone: values?.phone,
        dob: values?.dob,
      }),
    );

    if (user?.specialist?.id) {
      updateSpecialist({
        specializations: values.specializations,
        experience: values.experience,
        education: values.education,
      });
    }
  }

  async function onAvatarLoaded(
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: File) => void,
  ) {
    try {
      eventBus.emit(EventTypes.removeNotification, 'avatar_type_error');
      const files = e.target.files || null;
      const paths = [FileType.PNG, FileType.JPEG, FileType.GIF];

      if (!files) return;
      if (checkFileSize(files[0], MAX_IMAGE_SIZE)) throw new Error();
      if (!checkFileType(files[0], paths)) throw new Error();

      const fr = await uploadFiles(files);
      setImage(fr.result);
      setFieldValue('profilePhoto', files[0]);
    } catch (error) {
      eventBus.emit(EventTypes.notification, {
        title: 'Фото не добавлено!',
        message: `Допустимые типы: png, jpg, gif
                Максимальный размер: ${MAX_IMAGE_SIZE} мб`,
        type: NotificationType.DANGER,
        id: 'file_type_error',
        dismiss: {
          duration: 7000,
          onScreen: true,
        },
      });
    }
  }

  let readyToRender = !!user;
  if (isSpecialist) {
    readyToRender = readyToRender && !!specialist;
  }

  return (
    <>
      {readyToRender && (
        <EditProfileData
          specialist={specialist}
          options={options}
          image={image}
          onSubmit={onSubmit}
          loader={loader}
          onAvatarLoaded={onAvatarLoaded}
          user={user}
        />
      )}
    </>
  );
};

export default EditProfile;
