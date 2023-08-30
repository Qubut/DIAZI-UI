import { createReducer, on } from '@ngrx/store';
import { MqttClientState } from 'src/app/interfaces/mqtt-client-state';
import * as MqttActions from './mqtt-client.actions';
export const initialState: MqttClientState = {
  isConnected: false,
  receivedMessages: {},
  subscribedTopics: [],
  publishedTopics: [],
  subscriptionErrors: {},
  publishErrors: {},
};

export const mqttReducer = createReducer(
  initialState,
  on(MqttActions.setConnectionStatus, (state, { isConnected }) => ({
    ...state,
    isConnected,
  })),
  on(MqttActions.addReceivedMessage, (state, { topic, message }) => ({
    ...state,
    receivedMessages: {
      ...state.receivedMessages,
      [topic]: [...(state.receivedMessages[topic] || []), message],
    },
  })),
  on(MqttActions.subscribeToTopic, (state, { topic }) => ({
    ...state,
    subscribedTopics: [...state.subscribedTopics, topic],
  })),

  on(MqttActions.unsubscribeFromTopic, (state, { topic }) => ({
    ...state,
    subscribedTopics: state.subscribedTopics.filter((t) => t !== topic),
  })),

  on(MqttActions.addPublishedTopic, (state, { topic }) => ({
    ...state,
    publishedTopics: [...state.publishedTopics, topic],
  })),

  on(MqttActions.removePublishedTopic, (state, { topic }) => ({
    ...state,
    publishedTopics: state.publishedTopics.filter((t) => t !== topic),
  })),
  on(MqttActions.setSubscriptionError, (state, { topic, error }) => ({
    ...state,
    subscriptionErrors: {
      ...state.subscriptionErrors,
      [topic]: error,
    },
  })),
  on(MqttActions.publishError, (state, { topic, error }) => ({
    ...state,
    publishErrors: {
      ...state.publishErrors,
      [topic]: error,
    },
  }))
);
