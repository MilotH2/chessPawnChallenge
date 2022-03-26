import { Injectable } from '@angular/core';
import { Pawn } from '../models/pawn';

@Injectable({
  providedIn: 'root',
})
export class PawnService {
  constructor() {}

  // generates a new Pawn Model and returns it, the function that calls generatePawn must await before going to next step
  generatePawn(
    rowIndex: number,
    colIndex: number,
    color: string,
    facing: number
  ): Promise<Pawn> {
    return new Promise((resolve) => {
      let newPawn: Pawn = {
        rowIndex,
        colIndex,
        color, // WHITE or BLACK
        facing, // 0 -> WEST, 1 -> SOUTH, 2 -> EAST, 3 -> NORTH
        firstMove: true, // this checks if the PAWN has made the first move, so this way I can add two available movements for the first time
        image:
          color == 'WHITE' ? 'assets/whitePawn.png' : 'assets/blackPawn.png', // Checks what PAWN image to add
        logs: Array<string>(),
      };
      resolve(newPawn);
    });
  }
}
