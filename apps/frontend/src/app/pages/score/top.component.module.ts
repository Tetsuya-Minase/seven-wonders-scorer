import { NgModule } from '@angular/core';

import { TopComponent } from './top.component';
import { RouterModule } from '@angular/router';
import { topRoutes } from './top.routes';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserCardModule } from './components/user-card/user-card.component.module';
import { ScoreUpdateModalModule } from './components/score-update-modal/score-update-modal.component.module';
import { WebSocketService } from '../../services/websocket.service';
import { RoomService } from './services/room.service';
import { RoomState } from './state/room.state';

@NgModule({
  imports: [
    RouterModule.forChild(topRoutes),
    CommonModule,
    ReactiveFormsModule,
    UserCardModule,
    ScoreUpdateModalModule,
  ],
  exports: [],
  declarations: [TopComponent],
  providers: [WebSocketService, RoomService, RoomState],
})
export class TopModule {}
