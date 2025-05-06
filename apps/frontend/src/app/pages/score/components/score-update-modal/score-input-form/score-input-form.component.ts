import {
  Component,
  forwardRef,
  Host,
  input,
  OnInit,
  Optional,
  SkipSelf,
} from '@angular/core';
import { ScoreType } from './types/ScoreType';
import {
  ControlContainer,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'seven-wonders-scorer-score-input-form',
  templateUrl: 'score-input-form.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScoreInputFormComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class ScoreInputFormComponent implements ControlValueAccessor, OnInit {
  public type = input.required<ScoreType>({ alias: 'type' });
  public borderColorClass = input.required<string>({
    alias: 'borderColorClass',
  });
  public formControlName = input.required<string>({ alias: 'formControlName' });
  public typeLabel = '';
  public formId = '';
  public value = 0;
  public disabled = false;
  public onChange: (value: number) => void = () => undefined;
  public onTouched: () => void = () => undefined;

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    private readonly controlContainer: ControlContainer,
  ) {}

  public ngOnInit() {
    this.formId = `${this.type()}Id`;
    this.#setTypeLabel(this.type());

    console.log('controlContainer: ', this.controlContainer);
    if (this.controlContainer && this.controlContainer.control) {
      console.log('formControlName: ', this.formControlName());
      const formGroup = this.controlContainer.control;
      const control = formGroup.get(this.formControlName());
      if (control) {
        this.writeValue(control.value);
      }
    }
  }

  #setTypeLabel(type: ScoreType) {
    switch (type) {
      case 'civilization':
        this.typeLabel = '市民建造物得点';
        break;
      case 'military':
        this.typeLabel = '軍事トークン得点';
        break;
      case 'gear':
        this.typeLabel = '歯車枚数';
        break;
      case 'compass':
        this.typeLabel = 'コンパス枚数';
        break;
      case 'tablet':
        this.typeLabel = '石版枚数';
        break;
      case 'commercial':
        this.typeLabel = '商業建造物得点';
        break;
      case 'guild':
        this.typeLabel = 'ギルド得点';
        break;
      case 'city':
        this.typeLabel = '都市得点';
        break;
      case 'leader':
        this.typeLabel = '指導者得点';
        break;
      case 'coin':
        this.typeLabel = 'コイン得点';
        break;
      case 'wonder':
        this.typeLabel = '七不思議得点';
        break;
      default:
        this.typeLabel = 'unknown';
    }
  }

  public registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(value: number): void {
    this.value = value;
  }

  public onInputChange(value: any): void {
    const numValue = Number(value);
    this.value = numValue;
    this.onChange(numValue);
    this.onTouched();
  }
}
