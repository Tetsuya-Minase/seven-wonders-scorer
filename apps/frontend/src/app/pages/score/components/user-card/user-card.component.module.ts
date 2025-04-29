import { NgModule } from '@angular/core';

import { UserCardComponent } from './user-card.component';
import { ScoreItemComponent } from './score-item/score-item.component';

@NgModule({
  imports: [],
  exports: [UserCardComponent],
  declarations: [UserCardComponent, ScoreItemComponent],
  providers: [],
})
export class UserCardModule {}
