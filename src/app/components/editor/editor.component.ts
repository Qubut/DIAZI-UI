import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { EditorService } from 'src/app/services/editor.service';
import {
  trigger,
  style,
  animate,
  transition,
  sequence,
} from '@angular/animations';
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        sequence([
          animate(
            '500ms ease-out',
            style({
              opacity: 0.5,
              transform: 'translateY(25px)',
            })
          ),
          animate(
            '500ms ease-out',
            style({
              opacity: 1,
              transform: 'translateY(0)',
            })
          ),
        ]),
      ]),

      transition(':leave', [
        animate(
          '1000ms ease-in',
          style({
            opacity: 0,
            transform: 'scale(0.5)',
          })
        ),
      ]),
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
    trigger('rotateInOut', [
      transition(':enter', [
        style({ transform: 'rotate(180deg)' }),
        animate('500ms ease-out', style({ transform: 'rotate(0deg)' })),
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ transform: 'rotate(180deg)' })),
      ]),
    ]),
  ],
})
export class EditorComponent implements AfterViewInit, OnChanges {
  @ViewChild('editor') private editor?: ElementRef<HTMLElement>;
  @Input() data: any;

  constructor(private _editorService: EditorService) {}

  ngAfterViewInit(): void {
    this._editorService.setEditor(this.editor);
    this._editorService.configure();
    this._editorService.setValue(this.data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['data'] &&
      !changes['data'].firstChange &&
      changes['data'].currentValue !== changes['data'].previousValue
    ) {
      // Reset the editor value when 'data' input changes
      this._editorService.setValue(changes['data'].currentValue);
    }
  }
}
