import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, map } from 'rxjs';
import { DataState } from 'src/app/interfaces/data-state';
import { ApiService } from 'src/app/services/api.service';
import { EditorService } from 'src/app/services/editor.service';
import { MachinesService } from 'src/app/services/machines.service';
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
    private _apiService: ApiService,
    private _machinesService: MachinesService
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
    this._terminalService.write(`"${this.selectedMachine}" wird bearbeitet`);
  }
  onSave(machines: { [k: string]: any[] }) {
    const value = this._editorService.getValue();
    if (value) {
      const machine = JSON.parse(value);
      const machineId = this.selectedMachine;
      if (machineId && machines[machineId]) {
        this._store.dispatch(updateMachine({ machineId, machine }));
        this._terminalService.write(
          `Änderungen von "${this.selectedMachine}" wurden gespeichert`
        );
      }
    }
  }

  onSendAll(machines: { [k: string]: any[] }) {
    this._terminalService.write(`Daten werden gesendet`);

    // Das 2D-Array in ein 1D-Array umwandeln
    const data = Object.values(machines).flat();

    this._apiService.sendData(data).subscribe({
      next: (response) => {
        this._terminalService.write('Daten erfolgreich gesendet');
      },
      error: (err) => {
        this._terminalService.write('Fehler beim Senden der Daten:');
        this._terminalService.error(JSON.stringify(err.message, null, 2));
      },
      complete: () => {},
    });
  }
}
