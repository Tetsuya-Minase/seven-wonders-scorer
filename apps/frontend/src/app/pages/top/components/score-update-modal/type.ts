import { FormControl, FormGroup } from '@angular/forms';

export interface UpdateScoreForm {
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
