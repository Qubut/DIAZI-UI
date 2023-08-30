export interface MqttClientState {
  isConnected: boolean;
  receivedMessages: { [topic: string]: string[] };
  subscribedTopics: string[];
  publishedTopics: string[];
  subscriptionErrors: { [topic: string]: string | null };
  publishErrors: { [topic: string]: string | null };
}
