import { Component, Input, OnInit } from '@angular/core';
import { ScoreType } from './types/ScoreType';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'seven-wonders-scorer-score-item',
  templateUrl: 'score-item.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class ScoreItemComponent implements OnInit {
  @Input() public score = 0;
  @Input() public scoreType!: ScoreType;
  public label = '';
  public bgClass = '';

  public ngOnInit() {
    switch (this.scoreType) {
      case 'civilization':
        this.label = 'civilizationScore';
        this.bgClass = 'bg-bg_civilization_score';
        break;
      case 'military':
        this.label = 'militaryScore';
        this.bgClass = 'bg-bg_military_score';
        break;
      case 'science':
        this.label = 'scienceScore';
        this.bgClass = 'bg-bg_science_score';
        break;
      case 'commercial':
        this.label = 'commercialScore';
        this.bgClass = 'bg-bg_commercial_score';
        break;
      case 'guild':
        this.label = 'guildScore';
        this.bgClass = 'bg-bg_guild_score';
        break;
      case 'city':
        this.label = 'cityScore';
        this.bgClass = 'bg-bg_city_score';
        break;
      case 'leader':
        this.label = 'leaderScore';
        this.bgClass = 'bg-bg_leader_score';
        break;
      case 'coin':
        this.label = 'coinScore';
        this.bgClass = 'bg-bg_coin_score';
        break;
      case 'wonder':
        this.label = 'wonderScore';
        this.bgClass = 'bg-bg_wonder_score';
        break;
      default: {
        const _type: never = this.scoreType;
        throw new Error(`Unknown scoreType: ${_type}`);
      }
    }
  }
}
