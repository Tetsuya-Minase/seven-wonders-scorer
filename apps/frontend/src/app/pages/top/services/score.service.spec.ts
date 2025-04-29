import { TestBed } from '@angular/core/testing';
import { ScoreService } from './score.service';
import { ScoreListState } from '../state/score-list.state';
import { SIGNAL } from '@angular/core/primitives/signals';
import { signal } from '@angular/core';

describe('ScoreService', () => {
  describe('ScoreService', () => {
    let service: ScoreService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [ScoreService, { provide: ScoreListState }],
      });
      service = TestBed.inject(ScoreService);
    });
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('updateScore', () => {
    let service: ScoreService;
    let scoreListStateMock: ScoreListState;

    beforeEach(() => {
      jest.spyOn(ScoreListState.prototype, 'updateCivilScore');
      jest.spyOn(ScoreListState.prototype, 'updateMilitaryScore');
      jest.spyOn(ScoreListState.prototype, 'updateCityScore');
      jest.spyOn(ScoreListState.prototype, 'updateGuildScore');
      jest.spyOn(ScoreListState.prototype, 'updateCommercialScore');
      jest.spyOn(ScoreListState.prototype, 'updateScienceScore');
      jest.spyOn(ScoreListState.prototype, 'updateLeaderScore');
      jest.spyOn(ScoreListState.prototype, 'updateCoinScore');
      jest.spyOn(ScoreListState.prototype, 'updateWonderScore');

      scoreListStateMock = new ScoreListState();
      TestBed.configureTestingModule({
        providers: [
          ScoreService,
          { provide: ScoreListState, useValue: scoreListStateMock },
        ],
      });
      service = TestBed.inject(ScoreService);
    });
    it('スコア更新ができること', () => {
      const mockUsername = 'Test';
      const mockScore = {
        civilScore: 10,
        militaryScore: 10,
        scienceScore: {
          gear: 3,
          compass: 4,
          tablet: 5,
        },
        commercialScore: 6,
        guildScore: 7,
        cityScore: 8,
        leaderScore: 9,
        coinScore: 10,
        wonderScore: 11,
      };
      service.updateScore(mockUsername, mockScore);

      expect(scoreListStateMock.updateCivilScore).toHaveBeenCalledTimes(1);
      expect(scoreListStateMock.updateCivilScore).toHaveBeenCalledWith(
        mockUsername,
        mockScore.civilScore,
      );
      expect(scoreListStateMock.updateMilitaryScore).toHaveBeenCalledTimes(1);
      expect(scoreListStateMock.updateMilitaryScore).toHaveBeenCalledWith(
        mockUsername,
        mockScore.militaryScore,
      );
      expect(scoreListStateMock.updateScienceScore).toHaveBeenCalledTimes(1);
      expect(scoreListStateMock.updateScienceScore).toHaveBeenCalledWith(
        mockUsername,
        {
          gear: mockScore.scienceScore.gear,
          compass: mockScore.scienceScore.compass,
          tablet: mockScore.scienceScore.tablet,
        },
      );
      expect(scoreListStateMock.updateCommercialScore).toHaveBeenCalledTimes(1);
      expect(scoreListStateMock.updateCommercialScore).toHaveBeenCalledWith(
        mockUsername,
        mockScore.commercialScore,
      );
      expect(scoreListStateMock.updateGuildScore).toHaveBeenCalledTimes(1);
      expect(scoreListStateMock.updateGuildScore).toHaveBeenCalledWith(
        mockUsername,
        mockScore.guildScore,
      );
      expect(scoreListStateMock.updateCityScore).toHaveBeenCalledTimes(1);
      expect(scoreListStateMock.updateCityScore).toHaveBeenCalledWith(
        mockUsername,
        mockScore.cityScore,
      );
      expect(scoreListStateMock.updateLeaderScore).toHaveBeenCalledTimes(1);
      expect(scoreListStateMock.updateLeaderScore).toHaveBeenCalledWith(
        mockUsername,
        mockScore.leaderScore,
      );
      expect(scoreListStateMock.updateCoinScore).toHaveBeenCalledTimes(1);
      expect(scoreListStateMock.updateCoinScore).toHaveBeenCalledWith(
        mockUsername,
        mockScore.coinScore,
      );
      expect(scoreListStateMock.updateWonderScore).toHaveBeenCalledTimes(1);
      expect(scoreListStateMock.updateWonderScore).toHaveBeenCalledWith(
        mockUsername,
        mockScore.wonderScore,
      );
    });
  });

  describe('getScore', () => {
    let service: ScoreService;
    let scoreListStateMock: ScoreListState;

    beforeEach(() => {
      jest.spyOn(ScoreListState.prototype, 'asReadonly').mockReturnValue({
        scores: signal([
          {
            username: 'TestUser',
            civilScore: 10,
            militaryScore: 20,
            scienceScore: {
              gear: 3,
              compass: 4,
              tablet: 5,
            },
            commercialScore: 30,
            guildScore: 40,
            cityScore: 50,
            leaderScore: 60,
            coinScore: 70,
            wonderScore: 80,
          },
        ]),
      });

      scoreListStateMock = new ScoreListState();
      TestBed.configureTestingModule({
        providers: [
          ScoreService,
          { provide: ScoreListState, useValue: scoreListStateMock },
        ],
      });
      service = TestBed.inject(ScoreService);
    });

    it('スコアが取得できること', () => {
      const result = service.getScore();
      expect(result).toEqual([
        {
          username: 'TestUser',
          civilScore: 10,
          militaryScore: 20,
          scienceScore: {
            gear: 3,
            compass: 4,
            tablet: 5,
            sum: 21 + 9 + 16 + 25, // set point + gear point + compass point + tablet point
          },
          commercialScore: 30,
          guildScore: 40,
          cityScore: 50,
          leaderScore: 60,
          coinScore: 70,
          wonderScore: 80,
          sum: 431,
        },
      ]);
    });
  });
});
