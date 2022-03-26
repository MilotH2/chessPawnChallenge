export interface Pawn {
  facing: number;
  image: string;
  color: string;
  firstMove: boolean;
  rowIndex: number;
  colIndex: number;
  logs: Array<string>;
}
