import { Injectable } from '@angular/core';
import { NgTerminal } from 'ng-terminal';
import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { FitAddon } from 'xterm-addon-fit';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class TerminalService {
  readonly prompt = '\x1b[1;32m>>>\x1b[0m ';
  underlying?: Terminal;
  terminal?: NgTerminal;
  fitAddon?: FitAddon  

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId))
      this.fitAddon = new FitAddon();
  }

  configure() {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.terminal) return;
      this.underlying = this.terminal.underlying!!;
      if(this.fitAddon)
      this.underlying.loadAddon(this.fitAddon);
      this.underlying.options.fontSize = 20;
      this.underlying.loadAddon(new WebLinksAddon());
      this.terminal.setXtermOptions({
        fontFamily: '"Cascadia Code", Menlo, monospace',
        cursorBlink: true,
      });
      if(this.fitAddon)
      this.fitAddon.fit(); // fits terminal to container's size
      this.underlying.scrollLines(1); // scrolls down to keep the prompt at the last line
    }
  }

  setTerminal(terminal: NgTerminal) {
    this.terminal = terminal;
  }

  clear() {
    this.underlying?.clear();
  }

  async write(msg: string) {
    // Move cursor to the beginning of the line and then write the message
    await setTimeout(
      () => this.terminal?.write(`\r\n${this.prompt}${msg} `),
      100
    );
  }

  async error(msg: string) {
    const errorMsg = `\x1b[1;31mError: ${msg}\x1b[0m`;
    // Move cursor to the beginning of the line and then write the error message
    await setTimeout(
      () => this.terminal?.write(`\r\n${this.prompt}${errorMsg} `),
      100
    );
  }
}
