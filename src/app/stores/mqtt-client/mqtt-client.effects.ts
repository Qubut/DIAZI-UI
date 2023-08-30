import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as MqttClientActions from './mqtt-client.actions';
import { catchError, switchMap, map, tap, mergeMap } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
import { MqttClientService } from 'src/app/services/mqtt-client.service';
import { Store } from '@ngrx/store';

@Injectable()
export class MqttClientEffects {
  private topicSubscriptions: { [topic: string]: Subscription } = {};

  constructor(
    private actions$: Actions,
    private mqttService: MqttClientService,
    private _store: Store
  ) {}

  initiateConnection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MqttClientActions.initiateConnection),
      tap(() => this.mqttService.createConnection()),
      switchMap(() =>
        this.mqttService.onConnect.pipe(
          map(() =>
            MqttClientActions.setConnectionStatus({ isConnected: true })
          ),
          catchError(() =>
            of(MqttClientActions.setConnectionStatus({ isConnected: false }))
          )
        )
      )
    )
  );

  connectionError$ = createEffect(() =>
    this.mqttService.onError.pipe(
      map(() => MqttClientActions.setConnectionStatus({ isConnected: false }))
    )
  );

  subscribeToTopic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MqttClientActions.subscribeToTopic),
      mergeMap((action) => {
        const messageSubscription = this.mqttService
          .observeTopic(action.topic)
          .pipe(
            map((message) =>
              MqttClientActions.addReceivedMessage({
                topic: action.topic,
                message: message.payload.toString(),
              })
            ),
            catchError((error) =>
              of(
                MqttClientActions.setSubscriptionError({
                  topic: action.topic,
                  error:
                    error instanceof Error
                      ? error.message
                      : 'An unexpected error occurred',
                })
              )
            )
          );

        this.topicSubscriptions[action.topic] = messageSubscription.subscribe(); 
        return messageSubscription;
      })
    )
  );

  unsubscribeFromTopic$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MqttClientActions.unsubscribeFromTopic),
        tap((action) => {
          const subscription = this.topicSubscriptions[action.topic];
          if (subscription) {
            subscription.unsubscribe();
            delete this.topicSubscriptions[action.topic];
          }
        }),
        map(() => []) // Return an empty array, which means no further action is dispatched.
      ),
    { dispatch: false }
  );

  publishToTopic$ = createEffect(() =>
  this.actions$.pipe(
    ofType(MqttClientActions.publishMessage),
    switchMap(action => 
      this.mqttService.publishToTopic(action.topic, action.message).pipe(
        map(() => {
          this._store.dispatch(MqttClientActions.addPublishedTopic({topic: action.topic, message: action.message}));
          return MqttClientActions.publishSuccess();
        }),
        catchError((error: Error) => {
          const errMsg = error.message || 'An unexpected error occurred';
          return of(MqttClientActions.publishError({ topic: action.topic, error: errMsg }));
        })
      )
    )
  )
);

}
