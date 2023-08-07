import { Inject, Injectable, inject } from '@angular/core';
import { FunctionsUsingCSI, NgTerminal } from 'ng-terminal';
import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';

@Injectable({
  providedIn: 'root',
})
export class TerminalService {
  readonly prompt =
    '\n' + FunctionsUsingCSI.cursorColumn(1) + '\x1b[1;32m>>>\x1b[0m ';
  underlying?: Terminal;
  terminal?: NgTerminal;
  constructor() {}
  configure() {
    if (!this.terminal) return;
    this.underlying = this.terminal.underlying!!;
    this.underlying.options.fontSize = 20;
    this.underlying.loadAddon(new WebLinksAddon());
    this.terminal.setXtermOptions({
      fontFamily: '"Cascadia Code", Menlo, monospace',
      // theme: this.baseTheme,
      cursorBlink: true,
    });
    this.terminal.write(this.prompt + 'Waiting Authentication ...');
  }
  setTerminal(terminal:NgTerminal){
    this.terminal = terminal
  }
  async write(msg: string) {
    await setTimeout(
      () => this.terminal?.write(`\n${this.prompt}${msg}`),
      1000
    );
  }
}
