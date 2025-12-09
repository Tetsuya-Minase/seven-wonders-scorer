import { Injectable } from '@angular/core';
import { ScoreStateManager } from '../state/score-state';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly scoreListState: ScoreStateManager) {}

  public addUser(username: string): void {
    this.scoreListState.addUser(username);
  }

  public removeUser(username: string): void {
    this.scoreListState.removeUser(username);
  }
}
