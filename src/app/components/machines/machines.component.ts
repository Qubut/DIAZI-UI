import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, map } from 'rxjs';
import { DataState } from 'src/app/interfaces/data-state';
import { ApiService } from 'src/app/services/api.service';
import { EditorService } from 'src/app/services/editor.service';
import { TerminalService } from 'src/app/services/terminal.service';
import { updateMachine } from 'src/app/stores/data/data.actions';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.css'],
})
export class MachinesComponent implements OnInit {
  selectedMachine: string | null = null;
  machines$!: Observable<{ [k: string]: any[] } | null>;

  constructor(
    private _store: Store<{ data: DataState }>,
    private _terminalService: TerminalService,
    private _editorService: EditorService,
    private _apiService: ApiService
  ) {}

  ngOnInit() {
    this.machines$ = this._store.pipe(
      filter((s) => s.data.machines != null),
      map((s) => s.data.machines)
    );
  }

  onSelectMachine(machineId: string) {
    this.selectedMachine = machineId;
    this._terminalService.clear();
    this._terminalService.clear();
    this._terminalService.write(`Editing "${this.selectedMachine}"`);
  }
  onSave(machines: { [k: string]: any[] }) {
    const value = this._editorService.getValue();
    if (value) {
      const machine = JSON.parse(value);
      const machineId = this.selectedMachine
      if (machineId && machines[machineId]) {
        this._store.dispatch(updateMachine({ machineId, machine }));
        this._terminalService.write(`changes of "${this.selectedMachine} saved"`)
      }
    }
  }

  onSendAll(machines: { [k: string]: any[] }) {
    this._terminalService.write(`Sending data`);
    
    // Flatten the 2D array to a 1D array
    const data = Object.values(machines).flat();
  
    this._apiService.sendData(data).subscribe({
      next: (response) => {
        this._terminalService.write('Data sent successfully');
      },
      error: (err) => {
        this._terminalService.write('Error while sending data:');
        this._terminalService.error(err)
      },
      complete: () => {},
    });
  }
}
