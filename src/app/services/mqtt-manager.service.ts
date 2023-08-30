import { Injectable } from '@angular/core';
import { TerminalService } from './terminal.service';

@Injectable({
  providedIn: 'root',
})
export class MqttManagerService {
  constructor(private _terminalService: TerminalService) {}

  checkFileIsSent(o: any) {
    try {
      const elements = o['/file/received'];
      const status = JSON.parse(elements[elements.length - 1]);
      if(status['received'])
      this._terminalService.write(`Datei wurde gesendet`);
    } catch {
      if(!o)
      this._terminalService.write(`Datei wird gesendet`);
    }
  }
}
