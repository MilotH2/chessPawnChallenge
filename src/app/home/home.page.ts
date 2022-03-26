import { Component, OnInit } from '@angular/core';
import { ChessBoard } from '../models/chessBoard';
import { CardionalDirections } from '../models/chessEnums';
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

  // creating a NEW PAWN MODEL for Facing Direction and Color/ default are 0 and WHITE
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
    this.availableStepsOfSelectedPawn = [];
    this.selectedPawn = null;
  }

  // new pawn setup for facing direction and color
  directionSelectorChanged($event) {
    this.selectedDirection = $event.detail.value;
  }
  colorSelectorChanged($event) {
    this.selectedColor = $event.detail.value;
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
    // clear the selected square data
    this.clearSelectedPawnAndIndexes();

    // fill the indexes on the chessboard with the newly generated pawn
    this.chessBoard[newPawn.rowIndex][newPawn.colIndex] = newPawn;

    // select the newly created pawn
    this.selectedPawn = this.chessBoard[newPawn.rowIndex][newPawn.colIndex];

    // select square
    this.rowIndex = newPawn.rowIndex;
    this.colIndex = newPawn.colIndex;

    // check condition of the available steps
    this.checkConditionOfThePawnAndFillAvailablePawnSteps(
      this.selectedPawn,
      newPawn.rowIndex,
      newPawn.colIndex
    );
  }

  // if this function returns true, it means that the pawn can not move to other box, if false the pawn can move to other box square
  restrictMovement(chessBoardColumn: Pawn | null, rowIndex, colIndex) {
    console.log({
      chessBoardColumn,
      rowIndex,
      colIndex,
      rowIndexOnTS: this.rowIndex,
      colIndexOnTS: this.colIndex,
      pawn: this.selectedPawn,
    });

    // check if there is a selected pawn and clear pawn if user selects on an empty box
    if (this.selectedPawn) {
      if (this.selectedPawn.facing == 0 || this.selectedPawn.facing == 2) {
        if (this.rowIndex == rowIndex || this.colIndex != colIndex) {
          this.clearSelectedPawnAndIndexes();
        }
      } else if (this.selectedPawn.facing == 1 || this.selectedPawn.facing == 3)
        if (this.rowIndex != rowIndex || this.colIndex == colIndex) {
          this.clearSelectedPawnAndIndexes();
        }
    }

    // clear data if there is no pawn selected and no pawn on the selected box
    if (!chessBoardColumn && !this.selectedPawn) {
      this.colIndex = colIndex;
      this.rowIndex = rowIndex;
      this.availableStepsOfSelectedPawn = [];
      this.isCreatingNewPawn = true;
      this.selectedColor = 'WHITE';
      this.selectedDirection = 0;
      this.selectedPawn = null;
      return true;
    }

    // clear data if there is plan to create a new PAWN
    if (this.isCreatingNewPawn) {
      this.clearSelectedPawnAndIndexes();
    }

    // exclude all steps except possible paths
    if (this.colIndex !== -1 && this.rowIndex !== -1) {
      // return the opposite of showFreeBoxAndCheckAvailablePawnStepsList
      let excludedOrNo = this.showFreeBoxAndCheckAvailablePawnStepsList(
        rowIndex,
        colIndex
      );
      return !excludedOrNo;
    }
    // select pawn
    return false;
  }

  // on select of PAWN or EMPTY AVAILABLE BOX to move PAWN to other BOX
  selectPawnOrMoveToOtherBox(
    chessBoardColumn: Pawn | null,
    rowIndex,
    colIndex
  ) {
    console.table(this.chessBoard);
    // empty all other paths
    this.availableStepsOfSelectedPawn = [];

    // if there is a selected pawn
    if (this.colIndex != -1 && this.rowIndex != -1) {
      if (chessBoardColumn && this.selectedPawn) {
        // select other pawn if exists
        this.selectPawnFillData(chessBoardColumn, rowIndex, colIndex);
      } else {
        // update selectedPawn indexes with upcoming index
        this.selectedPawn.rowIndex = rowIndex;
        this.selectedPawn.colIndex = colIndex;

        // set first move false
        this.selectedPawn.firstMove = false;

        // empty current occupied box with selected PAWN
        this.chessBoard[this.rowIndex][this.colIndex] = null;

        // relocate selected pawn to other selected available box
        this.chessBoard[rowIndex][colIndex] = this.selectedPawn;

        // update new selected box indexes
        this.colIndex = colIndex;
        this.rowIndex = rowIndex;
        this.checkConditionOfThePawnAndFillAvailablePawnSteps(
          this.selectedPawn,
          rowIndex,
          colIndex
        );
      }
    } else {
      // select pawn for the first time
      this.selectPawnFillData(chessBoardColumn, rowIndex, colIndex);
    }
  }

  // this function fills data of the pawn when it is selected a new one or other pawn
  selectPawnFillData(chessBoardColumn, rowIndex, colIndex) {
    this.selectedPawn = chessBoardColumn;
    this.selectedPawn.rowIndex = rowIndex;
    this.selectedPawn.colIndex = colIndex;
    this.colIndex = colIndex;
    this.rowIndex = rowIndex;
    this.checkConditionOfThePawnAndFillAvailablePawnSteps(
      chessBoardColumn,
      rowIndex,
      colIndex
    );
  }

  // chech condition of the pawn based on the facing direction
  checkConditionOfThePawnAndFillAvailablePawnSteps(
    chessBoardColumn: Pawn,
    rowIndex,
    colIndex
  ) {
    if (chessBoardColumn.facing == CardionalDirections.WEST) {
      this.westCalculation(chessBoardColumn, rowIndex, colIndex);
    }
    if (chessBoardColumn.facing == CardionalDirections.SOUTH) {
      this.southCalculation(chessBoardColumn, rowIndex, colIndex);
    }
    if (chessBoardColumn.facing == CardionalDirections.EAST) {
      this.eastCalculation(chessBoardColumn, rowIndex, colIndex);
    }
    if (chessBoardColumn.facing == CardionalDirections.NORTH) {
      this.northCalculation(chessBoardColumn, rowIndex, colIndex);
    }
  }

  // this calculates PAWN Facing WEST squares where the PAWN is available to move.
  westCalculation(chessBoardColumn: Pawn, rowIndex, colIndex) {
    // check if first move isn't made
    if (chessBoardColumn.firstMove) {
      // check if first and second square are available
      if (
        !this.chessBoard[rowIndex - 1][colIndex] &&
        !this.chessBoard[rowIndex - 2][colIndex]
      ) {
        this.availableStepsOfSelectedPawn.push({
          rowIndex: rowIndex - 1,
          colIndex,
        });
        this.availableStepsOfSelectedPawn.push({
          rowIndex: rowIndex - 2,
          colIndex,
        });
      }
      // check if the first square is available
      else if (!this.chessBoard[rowIndex - 1][colIndex]) {
        this.availableStepsOfSelectedPawn.push({
          rowIndex: rowIndex - 1,
          colIndex,
        });
      }
    } else {
      // check if the first square is available
      if (rowIndex - 1 >= 0 && !this.chessBoard[rowIndex - 1][colIndex]) {
        this.availableStepsOfSelectedPawn.push({
          rowIndex: rowIndex - 1,
          colIndex,
        });
      }
    }
  }

  // this calculates PAWN Facing SOUTH squares where the PAWN is available to move.
  southCalculation(chessBoardColumn: Pawn, rowIndex, colIndex) {
    // check if first move isn't made
    if (chessBoardColumn.firstMove) {
      // check if first and second squares are available
      if (!this.chessBoard[rowIndex][colIndex - 1]) {
        this.availableStepsOfSelectedPawn.push({
          rowIndex,
          colIndex: colIndex - 1,
        });
      }
      if (
        !this.chessBoard[rowIndex][colIndex - 1] &&
        !this.chessBoard[rowIndex][colIndex - 2]
      ) {
        this.availableStepsOfSelectedPawn.push({
          rowIndex,
          colIndex: colIndex - 2,
        });
      }
    } else {
      // calculate first square
      if (
        colIndex !== 1 &&
        colIndex < 8 &&
        !this.chessBoard[rowIndex][colIndex - 1]
      ) {
        this.availableStepsOfSelectedPawn.push({
          rowIndex,
          colIndex: colIndex - 1,
        });
      }
      // calculate the end of square
      if (
        colIndex == 1 &&
        colIndex - 1 < 8 &&
        !this.chessBoard[rowIndex][colIndex - 1]
      ) {
        this.availableStepsOfSelectedPawn.push({
          rowIndex,
          colIndex: colIndex - 1,
        });
      }
    }
  }

  // this calculates PAWN Facing EAST squares where the PAWN is available to move.
  eastCalculation(chessBoardColumn: Pawn, rowIndex, colIndex) {
    // check if first move isn't made
    if (chessBoardColumn.firstMove) {
      // check if first and second squares are available
      if (!this.chessBoard[rowIndex + 1][colIndex]) {
        this.availableStepsOfSelectedPawn.push({
          rowIndex: rowIndex + 1,
          colIndex,
        });
      }
      if (
        !this.chessBoard[rowIndex + 1][colIndex] &&
        !this.chessBoard[rowIndex + 2][colIndex]
      ) {
        this.availableStepsOfSelectedPawn.push({
          rowIndex: rowIndex + 2,
          colIndex,
        });
      }
    } else {
      if (rowIndex + 1 < 8 && !this.chessBoard[rowIndex + 1][colIndex]) {
        this.availableStepsOfSelectedPawn.push({
          rowIndex: rowIndex + 1,
          colIndex,
        });
      }
    }
  }

  // this calculates PAWN Facing NORTH squares where the PAWN is available to move.
  northCalculation(chessBoardColumn: Pawn, rowIndex, colIndex) {
    if (chessBoardColumn.firstMove) {
      if (!this.chessBoard[rowIndex][colIndex + 1]) {
        this.availableStepsOfSelectedPawn.push({
          rowIndex,
          colIndex: colIndex + 1,
        });
      }
      if (
        !this.chessBoard[rowIndex][colIndex + 1] &&
        !this.chessBoard[rowIndex][colIndex + 2]
      ) {
        this.availableStepsOfSelectedPawn.push({
          rowIndex,
          colIndex: colIndex + 2,
        });
      }
    } else {
      if (colIndex + 1 < 8 && !this.chessBoard[rowIndex][colIndex + 1]) {
        this.availableStepsOfSelectedPawn.push({
          rowIndex,
          colIndex: colIndex + 1,
        });
      }
    }
  }

  // this function moves PAWN facing direction to LEFT and RIGHT
  movePawnDirection(newDirection: number) {
    console.log(this.selectedPawn);
    // First we check which direction is currently facing
    if (this.selectedPawn.facing == CardionalDirections.WEST) {
      this.recalculateCurrentFacingWest(newDirection);
    } else if (this.selectedPawn.facing == CardionalDirections.SOUTH) {
      this.recalculateCurrentFacingSouth(newDirection);
    } else if (this.selectedPawn.facing == CardionalDirections.EAST) {
      this.recaulculateCurrentFacingEast(newDirection);
    } else if (this.selectedPawn.facing == CardionalDirections.NORTH) {
      this.recalculateCurrentFacingNorth(newDirection);
    }
  }

  recalculateCurrentFacingWest(newDirection) {}
  recalculateCurrentFacingSouth(newDirection) {}
  recaulculateCurrentFacingEast(newDirection) {}
  recalculateCurrentFacingNorth(newDirection) {}

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

  // Default Image
  errorHandler(event, rowIndex, colIndex) {
    console.log(rowIndex, colIndex);
    event.target.src = 'assets/pawns/default.png';
  }
}
