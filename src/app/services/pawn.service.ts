import { Injectable } from '@angular/core';
import { Pawn } from '../models/pawn';

@Injectable({
  providedIn: 'root',
})
export class PawnService {
  constructor() {}

  // generates a new Pawn Model and returns it, i created this a promise because the create new pawn function must wait to create this before adding to the board
  generatePawn(
    rowIndex: number,
    colIndex: number,
    color: string,
    facing: number
  ): Promise<Pawn> {
    return new Promise((resolve, reject) => {
      let newPawn: Pawn = {
        rowIndex,
        colIndex,
        color, // WHITE or BLACK
        facing, // 0 -> WEST, 1 -> SOUTH, 2 -> EAST, 3 -> NORTH
        firstMove: true, // this checks if the PAWN has made the first move, so this way I can add two available movements for the first time
        image: color == 'WHITE' ? '' : '', // Checks what PAWN image to add
      };
      resolve(newPawn);
    });
  }
}
