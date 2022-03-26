import { Component, OnInit } from '@angular/core';
import { ChessBoard } from '../models/chessBoard';

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

  constructor() {}

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
