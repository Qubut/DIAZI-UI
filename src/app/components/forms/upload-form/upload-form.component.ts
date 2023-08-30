import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
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
  selectedFile: File | null = null;
  display: FormControl = new FormControl('');

  public uploadLimitSize = false;
  public jsonParseError = false;
  public isUploading = false;
  public uploadProgress = 0;
  readonly maxSize: number = 2242880;
  content: string = '';
  @Input() size!: number | string;
  isFileValid = false;
  form: FormGroup;
  json: { [k: string]: any } = {};
  error: any;
  constructor(private _fb: FormBuilder, private _store: Store<DataState>) {
    this.form = this._fb.group({
      file: new FormControl(null, Validators.required), // Added Validators.required here
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.form.valid && this.selectedFile) {
      this.form.value.file = this.selectedFile;
      this.form.markAsPristine();
      this.form.reset();
      this.selectedFile = null;
      this.display.patchValue(null);
    }
  }

  handleFileInputChange(event: any) {
    this.jsonParseError = false;
    this.uploadLimitSize = false;
    this.selectedFile = event.target.files[0];
    this.selectedFile!.name.replace('C:\\fakepath\\', '');
    // Validate file size
    if (this.selectedFile!.size > this.maxSize) {
      this.uploadLimitSize = true;
      this.selectedFile = null;
      this.display.patchValue(null);

      return;
    }

    this.isFileValid = true;
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        this.content = fileReader.result as string;
        this.json = JSON.parse(this.content);
      } catch (error) {
        this.jsonParseError = true;
        this.selectedFile = null;
        this.display.patchValue(null);
        this.error = error;
      }
    };

    fileReader.readAsText(this.selectedFile!);
    this.display.patchValue(this.selectedFile!.name ?? null);
  }
  sendFile() {
    console.log(this.error);
    console.log(this.content);
    if (this.error)
      this._store.dispatch(jsonParsedFailure({ error: this.error }));
    else {
      this._store.dispatch(
        publishMessage({
          topic: '/file/json',
          message: this.content,
        })
      );
      this._store.dispatch(jsonParsedSuccess({ json: this.json }));
      this._store.dispatch(subscribeToTopic({ topic: '/file/received' }));
      this._store.dispatch(subscribeToTopic({ topic: '/file/accepted' }));
      this._store.dispatch(subscribeToTopic({ topic: '/resources' }));
    }

    this.isFileValid = false;
  }
}
