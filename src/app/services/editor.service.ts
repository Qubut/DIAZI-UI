import { ElementRef, Injectable } from '@angular/core';
import * as ace from 'ace-builds';
@Injectable({
  providedIn: 'root',
})
export class EditorService {
  editor?: ElementRef<HTMLElement>;
  aceEditor?: ace.Ace.Editor;
  constructor() {}
  setEditor(editor?: ElementRef<HTMLElement>) {
    this.editor = editor;
  }
  configure() {
    ace.config.set('fontSize', '14px');
    ace.config.set(
      'basePath',
      'https://unpkg.com/ace-builds@1.4.12/src-noconflict'
    );
    if (this.editor) {
      this.aceEditor = ace.edit(this.editor.nativeElement);
      this.aceEditor.setTheme('ace/theme/monokai'); 
      this.aceEditor.session.setMode('ace/mode/json');
    }
  }
  setValue(data: any) {
    this.aceEditor?.setValue(JSON.stringify(data, null, 2));
  }
  getValue() {
    return this.aceEditor?.getValue();
  }
}
