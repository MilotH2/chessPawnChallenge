import { TestBed } from '@angular/core/testing';
import { Pawn } from '../models/pawn';

import { PawnService } from './pawn.service';

describe('PawnService', () => {
  let service: PawnService;
  let pawn: Pawn;

  beforeEach(() => {
    // TestBed.configureTestingModule({});
    // service = TestBed.inject(PawnService);

    service = new PawnService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a Pawn Interface from Given data', async () => {
    // const qouteText = 'This is my first post';
    pawn = await service.generatePawn(0, 1, 'BLACK', 2);
    expect(pawn).toBeTruthy();
  });

  it('should update logs list of the pawn for PLACE', () => {
    let logPlace = 'PLACE 0, 1, EAST, BLACK';
    pawn.logs.push(logPlace);
    expect(pawn.logs).toContain(logPlace);
  });
});
