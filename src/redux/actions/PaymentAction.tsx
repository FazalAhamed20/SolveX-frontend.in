import { PaymentAxios } from '../../config/AxiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleErrors } from '../../helper/HandleErrors';
import { Payment, Subscription } from '../../types/userData';
import { ErrorPayload } from '../../types/Helper';

interface VerifyResponse {
  success: any;
  data: string;
  message: string;
  status?: number;
  isBlocked?: boolean;
}

export const addSubscriptions = createAsyncThunk<
  VerifyResponse,
  Subscription,
  { rejectValue: ErrorPayload }
>(
  'payment/addSubscription',
  async (subscriptionData: Subscription, { rejectWithValue }) => {
    try {
      console.log(subscriptionData);

      const { data } = await PaymentAxios.post<VerifyResponse>(
        '/createsubscription',
        {
          name: subscriptionData.name,
          monthlyPrice: subscriptionData.monthlyPrice,
          yearlyPrice: subscriptionData.yearlyPrice,
          features: subscriptionData.features,
          title: subscriptionData.title,
          tier: subscriptionData.tier,
        },
      );
      console.log('data', data);

      return data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(handleErrors(error));
    }
  },
);

export const getAllSubscription = createAsyncThunk<
  VerifyResponse,
  void,
  { rejectValue: ErrorPayload }
>('payment/addSubscription', async (_, { rejectWithValue }) => {
  try {
    const { data } = await PaymentAxios.get<VerifyResponse>(
      '/subscription',
      {},
    );
    console.log('data', data);

    return data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(handleErrors(error));
  }
});

export const createPayment = createAsyncThunk<
  VerifyResponse,
  Payment,
  { rejectValue: ErrorPayload }
>(
  'payment/createpayment',
  async (paymentData: Payment, { rejectWithValue }) => {
    try {
      console.log(paymentData);

      const { data } = await PaymentAxios.post<VerifyResponse>(
        '/create-payment-intent',
        {
          amount: paymentData.amount,
          interval: paymentData.interval,
          subscriptionId: paymentData.subscriptionId,
          payment_method_id: paymentData.payment_method_id,
          userId: paymentData.userId,
        },
      );
      console.log('data', data);

      return data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(handleErrors(error));
    }
  },
);

export const checkSubscription = createAsyncThunk<
  VerifyResponse,
  any,
  { rejectValue: ErrorPayload }
>('payment/checkSubscription', async (userId: any, { rejectWithValue }) => {
  try {
    console.log(userId);

    const { data } = await PaymentAxios.post<VerifyResponse>(
      '/checkSubscription',
      {
        userId: userId.userId,
      },
    );
    console.log('data', data);

    return data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(handleErrors(error));
  }
});
