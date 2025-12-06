import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import type { Score } from '../../types/score';

import { ScoreItemComponent } from './score-item/score-item.component';

@Component({
  selector: 'seven-wonders-scorer-user-card',
  templateUrl: 'user-card.component.html',
  standalone: true,
  imports: [ScoreItemComponent],
})
export class UserCardComponent implements OnChanges, OnInit {
  @Input({ required: true }) score!: Score;
  @Output() openModalEvent: EventEmitter<string> = new EventEmitter<string>();

  #showModal: boolean | undefined;
  #username: string | undefined;

  public ngOnInit() {
    this.#username = this.score.username;
    this.#showModal = false;
  }

  public ngOnChanges(changes: SimpleChanges) {
    if ('score' in changes && changes['score'].currentValue == null) {
      throw new Error(`score is required.`);
    }
  }

  public openModal() {
    this.openModalEvent.emit(this.username);
  }

  public get showModal() {
    return !!this.#showModal;
  }

  public get username() {
    return this.#username || '';
  }
}
