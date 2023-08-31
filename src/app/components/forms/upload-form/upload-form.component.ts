import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { DataState } from 'src/app/interfaces/data-state';
import {
  jsonParsedFailure,
  jsonParsedSuccess,
} from 'src/app/stores/data/data.actions';
import {
  publishMessage,
  subscribeToTopic,
} from 'src/app/stores/mqtt-client/mqtt-client.actions';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css'],
})
export class UploadFormComponent implements OnInit {
  readonly MAX_SIZE_MB: number = 5;
  readonly MAX_SIZE_BYTES: number = this.MAX_SIZE_MB * 1024 * 1024;

  display: FormControl = new FormControl('');
  form: FormGroup;
  jsonParseError: boolean = false;
  isLoading: boolean = false;
  sizeLimitExceeded = false;
  json: { [k: string]: any } = {};
  error: any;
  input?: HTMLInputElement;
  content: string = '';
  constructor(private fb: FormBuilder, private store: Store<DataState>) {
    this.form = this.fb.group({
      file: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.form.valid) {
      this.store.dispatch(jsonParsedSuccess({ json: this.json }));
      this.form.reset();
    }
  }

  handleFileInputChange(event: Event) {
    this.input = event.target as HTMLInputElement;
    const file = this.input?.files?.[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      this.sizeLimitExceeded = fileSizeInMB > this.MAX_SIZE_MB;
      try {
        if (!this.sizeLimitExceeded) {
          this.display.setValue(file.name);
          this.form.get('file')?.setValue(file);
          this.parseFileContent(file);
        } else {
          this.display.setValue('');
          this.form.get('file')?.reset();
        }
      } catch (error) {
      } finally {
        if (file) this.parseFileContent(file);
      }
    }
  }

  sendFile() {
    if (this.error) {
      this.store.dispatch(jsonParsedFailure({ error: this.error }));
    } else {
      this.store.dispatch(jsonParsedSuccess({ json: this.json }));
    }
  }

  private resetFlags() {
    this.jsonParseError = false;
  }

  private parseFileContent(file: File) {
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      try {
        this.content = fileReader.result as string;
        this.json = JSON.parse(this.content);
      } catch (error) {
        this.jsonParseError = true;
        this.error = error;
        this.form.get('file')!.reset();
        this.display.setValue(null);
      }
    };

    fileReader.readAsText(file);
  }
}
