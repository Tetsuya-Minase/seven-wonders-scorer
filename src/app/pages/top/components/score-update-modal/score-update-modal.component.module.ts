import { NgModule } from '@angular/core';

import { ScoreUpdateModalComponent } from './score-update-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [ReactiveFormsModule],
  exports: [ScoreUpdateModalComponent],
  declarations: [ScoreUpdateModalComponent],
  providers: [],
})
export class ScoreUpdateModalModule {}
