import { NgModule } from '@angular/core';

import { ScoreUpdateModalComponent } from './score-update-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ScoreInputFormComponent } from './score-input-form/score-input-form.component';

@NgModule({
  imports: [ReactiveFormsModule],
  exports: [ScoreUpdateModalComponent],
  declarations: [ScoreUpdateModalComponent, ScoreInputFormComponent],
  providers: [],
})
export class ScoreUpdateModalModule {}
