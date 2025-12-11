import {
  Component,
  DestroyRef,
  effect,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RoomService } from '../../services/room.service';
import { UpdateScoreForm } from './type';
import { ScoreInputFormComponent } from './score-input-form/score-input-form.component';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'seven-wonders-scorer-score-update-modal',
  templateUrl: 'score-update-modal.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, ScoreInputFormComponent],
})
export class ScoreUpdateModalComponent {
  @Output() closeModalEvent: EventEmitter<void> = new EventEmitter<void>();
  public updateScoreForm: FormGroup<UpdateScoreForm>;

  public username = input.required<string>({ alias: 'username' });
  public showModal = input.required<boolean>({ alias: 'showModal' });

  public constructor(
    private readonly roomService: RoomService,
    private readonly scoreService: ScoreService,
    private readonly formBuilder: NonNullableFormBuilder,
    private readonly destroyRef: DestroyRef,
  ) {
    this.updateScoreForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      civilizationScore: [0, [Validators.min(0)]],
      militaryScore: [0, [Validators.min(0)]],
      scienceScore: this.formBuilder.group({
        gear: [0, [Validators.min(0)]],
        compass: [0, [Validators.min(0)]],
        tablet: [0, [Validators.min(0)]],
      }),
      commercialScore: [0, [Validators.min(0)]],
      guildScore: [0, [Validators.min(0)]],
      cityScore: [0, [Validators.min(0)]],
      leaderScore: [0, [Validators.min(0)]],
      coinScore: [0, [Validators.min(0)]],
      wonderScore: [0, [Validators.min(0)]],
    });

    effect(() => {
      this.updateScoreForm.patchValue({ username: this.username() });

      // ユーザー名が変更されたときに、そのユーザーの現在のスコアを取得してフォームに設定する
      const currentUsername = this.username();
      if (currentUsername) {
        const userScore = this.scoreService.getScoreByUsername(currentUsername);
        if (userScore) {
          this.updateScoreForm.patchValue({
            civilizationScore: userScore.civilScore,
            militaryScore: userScore.militaryScore,
            scienceScore: {
              gear: userScore.scienceScore.gear,
              compass: userScore.scienceScore.compass,
              tablet: userScore.scienceScore.tablet,
            },
            commercialScore: userScore.commercialScore,
            guildScore: userScore.guildScore,
            cityScore: userScore.cityScore,
            leaderScore: userScore.leaderScore,
            coinScore: userScore.coinScore,
            wonderScore: userScore.wonderScore,
          });
        }
      }
    });
  }

  public closeModal() {
    this.closeModalEvent.emit();
  }

  public updateScore() {
    if (!this.updateScoreForm.valid) {
      throw new Error(`updateScoreForm is invalid`);
    }
    this.roomService.updateScore(
      this.updateScoreForm.controls.username.value,
      {
        civilScore: this.updateScoreForm.controls.civilizationScore.value,
        militaryScore: this.updateScoreForm.controls.militaryScore.value,
        scienceScore: {
          gear: this.updateScoreForm.controls.scienceScore.controls.gear.value,
          compass:
            this.updateScoreForm.controls.scienceScore.controls.compass.value,
          tablet:
            this.updateScoreForm.controls.scienceScore.controls.tablet.value,
        },
        commercialScore: this.updateScoreForm.controls.commercialScore.value,
        guildScore: this.updateScoreForm.controls.guildScore.value,
        cityScore: this.updateScoreForm.controls.cityScore.value,
        leaderScore: this.updateScoreForm.controls.leaderScore.value,
        coinScore: this.updateScoreForm.controls.coinScore.value,
        wonderScore: this.updateScoreForm.controls.wonderScore.value,
      },
    );
    this.closeModal();
  }

  protected readonly FormControl = FormControl;
}
