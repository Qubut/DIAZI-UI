import { createAction, props } from '@ngrx/store';

export const setConnectionStatus = createAction(
  '[MQTT] Set Connection Status',
  props<{ isConnected: boolean }>()
);

export const initiateConnection = createAction('[MQTT] Initiate Connection');

export const addReceivedMessage = createAction(
  '[MQTT] Add Received Message',
  props<{ topic: string; message: string }>()
);

export const subscribeToTopic = createAction(
  '[MQTT] Subscribe to Topic',
  props<{ topic: string }>()
);

export const unsubscribeFromTopic = createAction(
  '[MQTT] Unsubscribe from Topic',
  props<{ topic: string }>()
);

export const addPublishedTopic = createAction(
  '[MQTT] Add Published Topic',
  props<{ topic: string; message: string }>() // Adjusted to include the message
);

export const removePublishedTopic = createAction(
  '[MQTT] Remove Published Topic',
  props<{ topic: string }>()
);

export const setSubscriptionError = createAction(
  '[MQTT] Set Subscription Error',
  props<{ topic: string; error: string | null }>()
);

export const publishMessage = createAction(
  '[MQTT] Publish Message',
  props<{ topic: string; message: string }>()
);

export const publishError = createAction(
  '[MQTT] Publish Error',
  props<{ topic: string; error: string }>()
);
export const publishSuccess = createAction(
  '[MQTT] Publish Succes',
);
