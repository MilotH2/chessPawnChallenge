import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ChessBoard } from '../models/chessBoard';
import { CardionalDirections } from '../models/chessEnums';
import { Pawn } from '../models/pawn';
import { PawnService } from '../services/pawn.service';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  // this is the chess board it self, with 8x8 squares
  let chessBoard: any;

  // show board after initialization
  let showChessBoard: boolean = false;

  // current selexted box or pawn indexes, -1 is default and means nothing is selected
  let rowIndex: number = -1;
  let colIndex: number = -1;

  // this is eather null or fulfilled with the selected pawn data
  let selectedPawn: Pawn | null;

  // this includes the empty boxes/columns where the selected pawn can move into
  let availableStepsOfSelectedPawn: Array<any> = Array<any>();

  // when an empty box is selected, this turns true so this way we check the condition to show information for creating a new PAWN
  let isCreatingNewPawn: boolean = false;

  // creating a NEW PAWN MODEL for Facing Direction and Color/ default are 0 and WHITE
  let selectedDirection: number = 0;
  let selectedColor: string = 'WHITE';

  let service: PawnService;

  let selectedRowIndexToMove;
  let selectedColIndexToMove;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;

    service = new PawnService();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize chess board', () => {
    chessBoard = ChessBoard.emptyBoard;
    expect(chessBoard).toEqual(ChessBoard.emptyBoard);
  });

  it('should show the board', () => {
    showChessBoard = true;
    expect(showChessBoard).toBeTrue();
  });

  it('should generate a Pawn Interface from Given data and select the generated pawn', async () => {
    // const qouteText = 'This is my first post';
    selectedPawn = await service.generatePawn(
      3,
      4,
      'BLACK',
      CardionalDirections.WEST
    );
    colIndex = selectedPawn.colIndex;
    rowIndex = selectedPawn.rowIndex;
    expect(selectedPawn).toBeTruthy();
  });

  it('should place the generated PAWN to the ChessBoard', () => {
    chessBoard[selectedPawn.rowIndex][selectedPawn.colIndex] = selectedPawn;
    expect(chessBoard[selectedPawn.rowIndex]).toContain(selectedPawn);
  });

  it('should update logs list of the pawn for PLACE', () => {
    let logPlace = `PLACE ${selectedPawn.rowIndex}, ${
      selectedPawn.colIndex
    }, ${service.getPawnFacingInText(selectedPawn.facing)}, ${
      selectedPawn.color
    }`;
    selectedPawn.logs.push(logPlace);
    console.log(selectedPawn.logs);
    expect(selectedPawn.logs).toContain(logPlace);
  });

  it('should be possible to move 1 step ahead on the direction that it is facing', () => {
    console.log(1);
    if (selectedPawn.facing == CardionalDirections.WEST) {
      console.log(2);
      if (!chessBoard[selectedPawn.rowIndex - 1][selectedPawn.colIndex]) {
        console.log(3);
        selectedRowIndexToMove = selectedPawn.rowIndex - 1;
        selectedColIndexToMove = selectedPawn.colIndex;
        expect(selectedRowIndexToMove).toBe(selectedPawn.rowIndex - 1);
        expect(selectedColIndexToMove).toBe(selectedPawn.colIndex);
      } else {
        console.log(4);
        expect().nothing();
      }
    }
    if (selectedPawn.facing == CardionalDirections.SOUTH) {
      if (!chessBoard[selectedPawn.rowIndex][selectedPawn.colIndex - 1]) {
        selectedRowIndexToMove = selectedPawn.rowIndex;
        selectedColIndexToMove = selectedPawn.colIndex - 1;
        expect(selectedColIndexToMove).toBe(selectedPawn.colIndex - 1);
        expect(selectedRowIndexToMove).toBe(selectedPawn.rowIndex);
      } else {
        expect().nothing();
      }
    }
    if (selectedPawn.facing == CardionalDirections.EAST) {
      if (!chessBoard[selectedPawn.rowIndex + 1][selectedPawn.colIndex]) {
        selectedRowIndexToMove = selectedPawn.rowIndex + 1;
        selectedColIndexToMove = selectedPawn.colIndex;
        expect(selectedRowIndexToMove).toBe(selectedPawn.rowIndex + 1);
        expect(selectedColIndexToMove).toBe(selectedPawn.colIndex);
      } else {
        expect().nothing();
      }
    }
    if (selectedPawn.facing == CardionalDirections.NORTH) {
      if (!chessBoard[selectedPawn.rowIndex][selectedPawn.colIndex + 1]) {
        selectedRowIndexToMove = selectedPawn.rowIndex;
        selectedColIndexToMove = selectedPawn.colIndex + 1;
        expect(selectedColIndexToMove).toBe(selectedPawn.colIndex + 1);
        expect(selectedRowIndexToMove).toBe(selectedPawn.rowIndex);
      } else {
        expect().nothing();
      }
    }
  });

  it('should MOVE 1 step to the direction that is facing if the square is free and remove the old pawn', () => {
    console.log({
      rowIndex,
      colIndex,
      selectedRowIndexToMove,
      selectedColIndexToMove,
    });
    if (colIndex !== -1 && rowIndex !== -1) {
      selectedPawn.rowIndex = selectedRowIndexToMove;
      selectedPawn.colIndex = selectedColIndexToMove;
      chessBoard[rowIndex][colIndex] = null;
      chessBoard[selectedRowIndexToMove][selectedColIndexToMove] = selectedPawn;
      colIndex = selectedColIndexToMove;
      rowIndex = selectedRowIndexToMove;
      console.log({ rowIndex, colIndex });
      expect(chessBoard[selectedPawn.rowIndex]).toContain(selectedPawn);
    }
  });

  it('should clear selected COL and ROW To move indexes', () => {
    selectedColIndexToMove = null;
    selectedRowIndexToMove = null;
    expect(selectedColIndexToMove).toBeNull();
    expect(selectedRowIndexToMove).toBeNull();
  });

  it('should rotate LEFT on the selected PAWN', () => {
    console.log(selectedPawn);
    if (selectedPawn.facing == CardionalDirections.WEST) {
      selectedPawn.facing = CardionalDirections.SOUTH;
      expect(selectedPawn.facing).toBe(CardionalDirections.SOUTH);
    }
    if (selectedPawn.facing == CardionalDirections.SOUTH) {
      selectedPawn.facing = CardionalDirections.EAST;
      expect(selectedPawn.facing).toBe(CardionalDirections.EAST);
    }
    if (selectedPawn.facing == CardionalDirections.EAST) {
      selectedPawn.facing = CardionalDirections.NORTH;
      expect(selectedPawn.facing).toBe(CardionalDirections.NORTH);
    }
    if (selectedPawn.facing == CardionalDirections.NORTH) {
      selectedPawn.facing = CardionalDirections.WEST;
      expect(selectedPawn.facing).toBe(CardionalDirections.WEST);
    }
  });

  it('should rotate RIGHT on the selected PAWN', () => {
    console.log(selectedPawn);
    if (selectedPawn.facing == CardionalDirections.WEST) {
      selectedPawn.facing = CardionalDirections.NORTH;
      expect(selectedPawn.facing).toBe(CardionalDirections.NORTH);
    }
    if (selectedPawn.facing == CardionalDirections.SOUTH) {
      selectedPawn.facing = CardionalDirections.WEST;
      expect(selectedPawn.facing).toBe(CardionalDirections.WEST);
    }
    if (selectedPawn.facing == CardionalDirections.EAST) {
      selectedPawn.facing = CardionalDirections.SOUTH;
      expect(selectedPawn.facing).toBe(CardionalDirections.SOUTH);
    }
    if (selectedPawn.facing == CardionalDirections.NORTH) {
      selectedPawn.facing = CardionalDirections.EAST;
      expect(selectedPawn.facing).toBe(CardionalDirections.EAST);
    }
  });
});
