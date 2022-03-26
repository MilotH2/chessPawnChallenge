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

  // when an empty box is selected, this turns true so this way we check the condition to show information for creating a new PAWN
  isCreatingNewPawn: boolean = false;

  // creating a NEW PAWN MODEL for Facing Direction and Color
  selectedDirection: number = 0;
  selectedColor: string = 'WHITE';

  constructor(
    // service to generate a new pawn model
    private pawnService: PawnService
  ) {}

  ngOnInit() {
    this.initializeChessBoard();
  }

  // Initializes the chess board
  initializeChessBoard() {
    this.chessBoard = ChessBoard.emptyBoard;
    this.showChessBoard = true;
  }

  // empties the board
  clearBoard() {
    this.chessBoard = ChessBoard.emptyBoard;
  }

  // Colors the Chess Board on condition, to show white and black color of the box
  addBoxColor(rowIndex, colIndex) {
    return (rowIndex + colIndex) % 2 === 1;
  }
}
