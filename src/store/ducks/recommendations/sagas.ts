import { call, put, takeLatest } from 'redux-saga/effects';
import { HTTP_SUCCESS } from '../../../http/httpConstants';
import RecommendationService from '../../../services/RecommendationService';
import { LoadingStatus } from '../../types';
import {
  setRecommendationsData,
  setRecommendationsLoadingStatus,
} from './actionCreators';
import {
  FetchRecommendationsDataActionInterface,
  RecommendationsActionsType,
} from './contracts/actionTypes';

export function * fetchRecommendationsDataRequest({
  payload,
}: FetchRecommendationsDataActionInterface) {
  try {
    yield put(setRecommendationsLoadingStatus(LoadingStatus.LOADING));
    const { data, status } = yield call(RecommendationService.geAll, payload);
    if (status === HTTP_SUCCESS) {
      yield put(setRecommendationsData(data));
      yield put(setRecommendationsLoadingStatus(LoadingStatus.SUCCESS));
    } else {
      yield put(setRecommendationsLoadingStatus(LoadingStatus.ERROR));
    }
  } catch (error) {
    yield put(setRecommendationsLoadingStatus(LoadingStatus.ERROR));
  }
}

export function * recommendationsSaga() {
  yield takeLatest(
    RecommendationsActionsType.FETCH_RECOMMENDATIONS_DATA,
    fetchRecommendationsDataRequest
  );
}
