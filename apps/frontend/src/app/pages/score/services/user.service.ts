import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ScoreActions } from '../+state';

/**
 * UserService - NgRx Facade for user management
 * Handles adding and removing users from the score tracking system
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly store = inject(Store);

  /**
   * Add a new user to the score tracking system
   * @param username unique username for the user
   */
  public addUser(username: string): void {
    this.store.dispatch(ScoreActions.addUser({ username }));
  }

  /**
   * Remove a user from the score tracking system
   * @param username username of the user to remove
   */
  public removeUser(username: string): void {
    this.store.dispatch(ScoreActions.removeUser({ username }));
  }
}
