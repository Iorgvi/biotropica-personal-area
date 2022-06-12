import { Recommendation } from '../@types/entities/Recommendation';
import { Specialization } from '../@types/entities/Specialization';
import { BaseUser } from '../@types/entities/BaseUser';
import { baseApi } from './base-api';

// FIXME: DTO
type CreateRecommendationDto = Pick<
  Recommendation,
  'title' | 'description' | 'status'
> & {
  userId: number;
  specialization: Pick<Specialization, 'id'> | number;
};

export const recommendationApi = baseApi.injectEndpoints({
  endpoints(builder) {
    return {
      getRecommendationList: builder.query<
        Recommendation[],
        { userId: number }
      >({
        query(params) {
          return {
            method: 'GET',
            url: 'recommendations',
            params,
          };
        },
        providesTags: result =>
          result
            ? [
                ...result.map(
                  ({ id }) => ({ type: 'Recommendation', id } as const),
                ),
                { type: 'Recommendation', id: 'LIST' },
              ]
            : [{ type: 'Recommendation', id: 'LIST' }],
      }),

      getWaitingUsers: builder.query<BaseUser[], void>({
        query() {
          return {
            method: 'GET',
            url: 'recommendations/waiting',
          };
        },
      }),

      getRecommendation: builder.query<Recommendation, number>({
        query(id) {
          return {
            method: 'GET',
            url: `recommendations/${id}`,
          };
        },
        providesTags: (result, error, id) => [{ type: 'Recommendation', id }],
      }),

      createRecommendation: builder.mutation<
        Recommendation,
        CreateRecommendationDto
      >({
        query(recommendation) {
          return {
            method: 'POST',
            url: 'recommendations',
            body: recommendation,
          };
        },
        invalidatesTags: [{ type: 'Recommendation', id: 'LIST' }],
      }),

      updateRecommendation: builder.mutation<
        Recommendation,
        Partial<Recommendation> & Pick<Recommendation, 'id'>
      >({
        query(recommendation) {
          return {
            method: 'PUT',
            url: `recommendations/${recommendation.id}`,
            body: recommendation,
          };
        },
        invalidatesTags: (r, e, { id }) => [{ type: 'Recommendation', id }],
      }),

      deleteRecommendation: builder.mutation<Recommendation, number>({
        query(id) {
          return {
            method: 'DELETE',
            url: `recommendations/${id}`,
          };
        },
        invalidatesTags: [{ type: 'Recommendation', id: 'LIST' }],
      }),
    };
  },
});

export const {
  useCreateRecommendationMutation,
  useDeleteRecommendationMutation,
  useGetRecommendationQuery,
  useGetRecommendationListQuery,
  useLazyGetRecommendationQuery,
  useUpdateRecommendationMutation,
  useGetWaitingUsersQuery,
} = recommendationApi;
