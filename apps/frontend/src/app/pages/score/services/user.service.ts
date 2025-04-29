import { Injectable } from '@angular/core';
import { ScoreListState } from '../state/score-list.state';

@Injectable()
export class UserService {
  constructor(private readonly scoreListState: ScoreListState) {}

  public addUser(username: string): void {
    this.scoreListState.addUser(username);
  }

  public removeUser(username: string): void {
    this.scoreListState.removeUser(username);
  }
}
