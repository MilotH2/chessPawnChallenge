import { Component, OnInit } from '@angular/core';
import { ChessBoard } from '../models/chessBoard';
import { Pawn } from '../models/pawn';
import { PawnService } from '../services/pawn.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  // this is the chess board it self, with 8x8 squares
  chessBoard: any;

  // show board after initialization
  showChessBoard: boolean = false;

  // current selexted box or pawn indexes, -1 is default and means nothing is selected
  rowIndex: number = -1;
  colIndex: number = -1;

  // this is eather null or fulfilled with the selected pawn data
  selectedPawn: Pawn | null;

  // this includes the empty boxes/columns where the selected pawn can move into
  availableStepsOfSelectedPawn: Array<any> = Array<any>();

  // when an empty box is selected, this turns true so this way we check the condition to show information for creating a new PAWN
  isCreatingNewPawn: boolean = false;

  // creating a NEW PAWN MODEL for Facing Direction and Color
  selectedDirection: number = 0;
  selectedColor: string = 'WHITE';

  constructor(
    // service to generate a new pawn model
    private pawnService: PawnService
  ) {}

  ngOnInit(): void {
    this.initializeChessBoard();
  }

  // Initializes the chess board
  initializeChessBoard(): void {
    this.chessBoard = ChessBoard.emptyBoard;
    this.showChessBoard = true;
  }

  // empties the board
  clearBoard(): void {
    this.chessBoard = ChessBoard.emptyBoard;
  }

  // empty selections, clear all
  clearSelectedPawnAndIndexes(): void {
    this.colIndex = -1;
    this.rowIndex = -1;
    this.isCreatingNewPawn = false;
    this.selectedPawn = null;
  }

  // this is the function that creates a new pawn on a currently selected empty box
  async createNewPawn() {
    let newPawn: Pawn = await this.pawnService.generatePawn(
      this.rowIndex,
      this.colIndex,
      this.selectedColor,
      this.selectedDirection
    );
    console.log(newPawn);
  }

  // Colors the Chess Board on condition, to show white and black color of the box
  addBoxColor(rowIndex, colIndex) {
    return (rowIndex + colIndex) % 2 === 1;
  }

  // show selected square color
  showHighlightedBoxColor(rowIndex, colIndex) {
    return rowIndex == this.rowIndex && colIndex == this.colIndex;
  }

  // show the selectedPawn in which square can move freebox
  showFreeBoxAndCheckAvailablePawnStepsList(rowIndex, colIndex) {
    for (
      let count = 0;
      count < this.availableStepsOfSelectedPawn.length;
      count++
    ) {
      if (
        rowIndex == this.availableStepsOfSelectedPawn[count].rowIndex &&
        colIndex == this.availableStepsOfSelectedPawn[count].colIndex
      ) {
        return true;
      }
    }
    return false;
  }

  // empty box select color
  selectNewBoxColorForCreatingNewPawn(chessBoardColumn, rowIndexx, colIndexx) {
    if (
      this.isCreatingNewPawn &&
      !chessBoardColumn &&
      rowIndexx == this.rowIndex &&
      colIndexx == this.colIndex
    ) {
      return true;
    } else {
      return false;
    }
  }
}
