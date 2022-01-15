import { RootState } from '../../store';

import { UserState } from './contracts/state';

export const selectUserState = (state: RootState): UserState => state.user;

export const selectUserData = (state: RootState): UserState['user'] =>
  selectUserState(state).user;

export const selectUserResponse = (state: RootState): UserState['response'] =>
  selectUserState(state).response;

export const selectIsAuth = (): boolean => !!window.localStorage.getItem('token');

export const selectUserStatus = (state: RootState): UserState['status'] =>
  selectUserState(state).status;

export const selectUserLoadingStatus = (state: RootState): string =>
  selectUserState(state).status;
