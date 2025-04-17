import { Component } from '@angular/core';
import { ScoreService } from './services/score.service';
import { UserService } from './services/user.service';
import { NonNullableFormBuilder } from '@angular/forms';

@Component({
    selector: 'seven-wonders-scorer-top',
    templateUrl: 'top.component.html',
    standalone: false
})
export class TopComponent {
  public showModal = false;
  public username = '';

  constructor(
    private readonly scoreService: ScoreService,
    private readonly userService: UserService,
    private readonly formBuilder: NonNullableFormBuilder
  ) {
    this.userService.addUser('Alice');
    this.userService.addUser('Bob');
    this.userService.addUser('Charlie');
  }

  public addUser(): void {
    // TODO: current code is debug code. Remove this code after implementing the UI.
    this.userService.addUser('Alice');
    this.userService.addUser('Bob');
    this.userService.addUser('Charlie');
  }

  public openModal(username: string) {
    this.showModal = true;
    this.username = username;
  }

  public closeModal() {
    this.showModal = false;
    this.username = '';
  }

  public get scores() {
    return this.scoreService.getScore();
  }
}
