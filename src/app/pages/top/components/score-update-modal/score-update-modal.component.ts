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
} from '@angular/forms';
import { ScoreService } from '../../services/score.service';

interface UpdateScoreForm {
  username: FormControl<string>;
  civilizationScore: FormControl<number>;
  militaryScore: FormControl<number>;
  scienceScore: FormGroup<{
    gear: FormControl<number>;
    compass: FormControl<number>;
    tablet: FormControl<number>;
  }>;
  commercialScore: FormControl<number>;
  guildScore: FormControl<number>;
  cityScore: FormControl<number>;
  leaderScore: FormControl<number>;
  coinScore: FormControl<number>;
  wonderScore: FormControl<number>;
}

@Component({
  selector: 'seven-wonders-scorer-score-update-modal',
  templateUrl: 'score-update-modal.component.html',
})
export class ScoreUpdateModalComponent {
  @Output() closeModalEvent: EventEmitter<void> = new EventEmitter<void>();
  public updateScoreForm: FormGroup<UpdateScoreForm>;

  public username = input.required<string>({ alias: 'username' });
  public showModal = input.required<boolean>({ alias: 'showModal' });

  public constructor(
    private readonly scoreService: ScoreService,
    private readonly formBuilder: NonNullableFormBuilder,
    private readonly destroyRef: DestroyRef
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
      console.log('username: ', this.username());
      this.updateScoreForm.patchValue({ username: this.username() });
    });
  }

  public closeModal() {
    this.closeModalEvent.emit();
    this.updateScoreForm.reset();
  }

  public updateScore() {
    if (!this.updateScoreForm.valid) {
      throw new Error(`updateScoreForm is invalid`);
    }
    this.scoreService.updateScore(
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
      }
    );
  }
}
