import { NgModule } from '@angular/core';
import { ScoreComponent } from './score.component';
import { RouterModule } from '@angular/router';
import { scoreRoutes } from './score.routes';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserCardModule } from './components/user-card/user-card.component.module';
import { ScoreUpdateModalModule } from './components/score-update-modal/score-update-modal.component.module';
import { WebSocketService } from '../../services/websocket.service';
import { RoomService } from './services/room.service';
import { RoomState } from './state/room.state';

@NgModule({
  imports: [
    RouterModule.forChild(scoreRoutes),
    CommonModule,
    ReactiveFormsModule,
    UserCardModule,
    ScoreUpdateModalModule,
  ],
  exports: [],
  declarations: [ScoreComponent],
  providers: [WebSocketService, RoomService, RoomState],
})
export class ScoreModule {}
