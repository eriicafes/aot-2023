type Connect4Chips = '🔴' | '🟡';
type Connect4Cell = Connect4Chips | '  ';
type Connect4State = '🔴' | '🟡' | '🔴 Won' | '🟡 Won' | 'Draw';

type EmptyBoard = [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
];

export type NewGame = {
    board: EmptyBoard;
    state: "🟡";
};

type EmptyCell = Exclude<Connect4Cell, Connect4Chips>
type Game = { board: Connect4Cell[][], state: Connect4Chips }
type ColumnIndex = Exclude<keyof EmptyBoard[number], keyof any[]>

type Skip<T extends any[], I extends number, Acc extends any[] = []> = Acc["length"] extends I
    ? T
    : T extends [infer F, ...infer R] ? Skip<R, I, [...Acc, F]> : []
type AppendAt<T extends any[], U, I extends number> = { [K in keyof T]: `${I}` extends K ? U : T[K] }
type Includes<T extends any[], U> = T extends [infer F, ...infer R] ? F extends U ? true : Includes<R, U> : false
type Next<T, $acc extends any[] = []> = $acc["length"] extends T ? [...$acc, 0]["length"] : Next<T, [...$acc, 0]>
type ToNumber<T> = T extends `${infer I extends number}` ? I : never
type Reverse<T, $acc extends any[] = []> = T extends [infer F, ...infer R] ? Reverse<R, [F, ...$acc]> : $acc
type ReverseBoard<T extends any[][]> = { [K in keyof T]: Reverse<T[K]> }

type DiagonalCursors = [
    [0, 1, 2, 3],
    [0],
    [0],
]

type BuildDiagonal<T extends any[][], I extends number, $acc extends any[] = []> =
    T extends [infer First extends any[], ...infer Rest extends any[][]]
    ? First[I] extends undefined ? $acc : BuildDiagonal<Rest, Next<I>, [...$acc, First[I]]>
    : $acc

type BuildColumn<T extends any[][], I extends number, $acc extends any[] = []> =
    T extends [infer First extends any[], ...infer Rest extends any[][]]
    ? BuildColumn<Rest, I, [...$acc, First[I]]>
    : $acc

type Has4<T extends any[], U, $acc extends U[] = []> = $acc["length"] extends 4
    ? true
    : T extends [infer C, ...infer Rest] ? Has4<Rest, U, C extends U ? [...$acc, C] : []> : false

type CheckRowsHas4<T extends any[][], U> = T extends [...infer Rest extends any[][], infer Last extends any[]]
    ? Has4<Last, U> extends true ? true : CheckRowsHas4<Rest, U>
    : false

type CheckColumnsHas4<T extends any[][], U> = true extends {
    [K in ColumnIndex]: Has4<BuildColumn<T, ToNumber<K>>, U>
}[ColumnIndex] ? true : false

type CheckDiagonalsHas4<T extends any[][], U> = true extends {
    [K in ColumnIndex]: Includes<
        DiagonalCursors[ToNumber<K>] extends infer Cursor extends number[]
        ? { [C in keyof Cursor]: Has4<BuildDiagonal<Skip<T, ToNumber<K>>, Cursor[C]>, U> }
        : [],
        true
    >
}[ColumnIndex] ? true : false

type CheckHasEmptyCell<T extends any[][]> = T extends [infer First extends any[], ...infer Rest extends any[][]]
    ? EmptyCell extends First[number] ? true : CheckHasEmptyCell<Rest>
    : false

type UpdateBoard<Board, Chip, Position extends number, $acc extends any[] = []> =
    Board extends [...infer RestRows, infer Row extends string[]]
    ? Row[Position] extends EmptyCell
    ? [...RestRows, AppendAt<Row, Chip, Position>, ...$acc]
    : UpdateBoard<RestRows, Chip, Position, [Row, ...$acc]>
    : $acc

type GetState<Board extends Connect4Cell[][], State extends Connect4Chips> =
    Includes<[
        CheckRowsHas4<Board, State>,
        CheckColumnsHas4<Board, State>,
        CheckDiagonalsHas4<Board, State>,
        CheckDiagonalsHas4<ReverseBoard<Board>, State>
    ], true> extends true
    ? `${State} Won`
    : CheckHasEmptyCell<Board> extends true ? Exclude<Connect4Chips, State> : "Draw"

export type Connect4<G extends Game, P extends number> = {
    board: UpdateBoard<G["board"], G["state"], P>,
    state: GetState<UpdateBoard<G["board"], G["state"], P>, G["state"]>
}
