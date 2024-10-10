import { NgModule } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ScoreUpdateModalComponent } from './score-update-modal.component';
import { ScoreInputFormComponent } from './score-input-form/score-input-form.component';

@NgModule({
  imports: [ReactiveFormsModule, NgClass, FormsModule],
  exports: [ScoreUpdateModalComponent],
  declarations: [ScoreUpdateModalComponent, ScoreInputFormComponent],
  providers: [],
})
export class ScoreUpdateModalModule {}
