import { Injectable } from '@angular/core';
import {
  IMqttMessage,
  MqttService,
  IMqttServiceOptions,
  IOnConnectEvent,
} from 'ngx-mqtt';
import { IClientSubscribeOptions } from 'mqtt-browser';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MqttClientService {
  constructor(private client: MqttService) {}

  public createConnection(): void {
    this.client.connect(environment.mqtt as IMqttServiceOptions);
  }

  public get onConnect(): Observable<IOnConnectEvent> {
    return this.client.onConnect;
  }

  public get onError(): Observable<Error> {
    return this.client.onError;
  }

  public observeTopic(topic: string): Observable<IMqttMessage> {
    return this.client.observe(topic, { qos: 2 } as IClientSubscribeOptions);
  }

  public publishToTopic(topic: string, message: string): Observable<void> {
    return this.client.publish(topic, message, { qos: 2 });
  }
}
