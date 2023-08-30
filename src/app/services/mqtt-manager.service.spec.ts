import { TestBed } from '@angular/core/testing';

import { MqttManagerService } from './mqtt-manager.service';

describe('MqttManagerService', () => {
  let service: MqttManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqttManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
