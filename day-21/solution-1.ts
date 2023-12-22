type TicTacToeChip = '❌' | '⭕';
type TicTacToeEndState = '❌ Won' | '⭕ Won' | 'Draw';
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = '  '
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = 'top' | 'middle' | 'bottom';
type TicTacToeXPositions = 'left' | 'center' | 'right';
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTactToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
    board: TicTactToeBoard;
    state: TicTacToeState;
};

type EmptyBoard = [
    ['  ', '  ', '  '],
    ['  ', '  ', '  '],
    ['  ', '  ', '  ']
];

type NewGame = {
    board: EmptyBoard;
    state: '❌';
};

type TicTacToePosition = `${TicTacToeYPositions}-${TicTacToeXPositions}`

type Serialize<Game> = Game extends [
    [infer TR extends string, infer TC extends string, infer TL extends string],
    [infer ML extends string, infer MC extends string, infer MR extends string],
    [infer BL extends string, infer BC extends string, infer BR extends string],
] ? `${TR}-${TC}-${TL},${ML}-${MC}-${MR},${BL}-${BC}-${BR}` : never

type Deserialize<Game> = Game extends `${infer TR}-${infer TC}-${infer TL},${infer ML}-${infer MC}-${infer MR},${infer BL}-${infer BC}-${infer BR}`
    ? [[TR, TC, TL], [ML, MC, MR], [BL, BC, BR]]
    : never

type InsertX<T, U extends string, X extends TicTacToeXPositions> =
    T extends `${infer L}-${infer C}-${infer R}`
    ? X extends "left" ? `${U}-${C}-${R}` : X extends "center" ? `${L}-${U}-${R}` : X extends "right" ? `${L}-${C}-${U}` : never
    : never

type Insert<T, U extends string, P extends TicTacToePosition> =
    P extends `${infer Y extends TicTacToeYPositions}-${infer X extends TicTacToeXPositions}`
    ? T extends `${infer T},${infer M},${infer B}`
    ? Y extends "top" ? `${InsertX<T, U, X>},${M},${B}` : Y extends "middle" ? `${T},${InsertX<M, U, X>},${B}` : Y extends "bottom" ? `${T},${M},${InsertX<B, U, X>}` : never
    : never
    : T

type GetCellX<T, X extends TicTacToeXPositions> =
    T extends `${infer L}-${infer C}-${infer R}`
    ? X extends "left" ? L : X extends "center" ? C : X extends "right" ? R : never
    : never

type GetCell<T, P extends TicTacToePosition> =
    P extends `${infer Y extends TicTacToeYPositions}-${infer X extends TicTacToeXPositions}`
    ? T extends `${infer T},${infer M},${infer B}`
    ? Y extends "top" ? GetCellX<T, X> : Y extends "middle" ? GetCellX<M, X> : Y extends "bottom" ? GetCellX<B, X> : never
    : never
    : T

type WinPositions<T extends string> = [
    // vertical
    `${T}-${T}-${T},${string},${string}`,
    `${string},${T}-${T}-${T},${string}`,
    `${string},${string},${T}-${T}-${T}`,
    // diagonal
    `${T}-${string}-${string},${string}-${T}-${string},${string}-${string}-${T}`,
    `${string}-${string}-${T},${string}-${T}-${string},${T}-${string}-${string}`,
    // horizontal
    `${T}-${string}-${string},${T}-${string}-${string},${T}-${string}-${string}`,
    `${string}-${T}-${string},${string}-${T}-${string},${string}-${T}-${string}`,
    `${string}-${string}-${T},${string}-${string}-${T},${string}-${string}-${T}`,
][number]
type IsWinner<Game extends string, Player extends string> = Game extends WinPositions<Player> ? true : false
type IsGameOver<Game extends string> = Game extends `${string}${TicTacToeEmptyCell}${string}` ? false : true

type Game = {
    board: TicTactToeBoard
    state: TicTacToeChip
}

type PlaySerializedGame<
    Game extends string,
    Player extends TicTacToeChip,
    Position extends TicTacToePosition,
> = GetCell<Game, Position> extends TicTacToeEmptyCell
    ? Insert<Game, Player, Position> extends infer Result extends string
    ? {
        board: Deserialize<Result>,
        state: IsWinner<Result, Player> extends true ? `${Player} Won`
        : IsWinner<Result, Exclude<TicTacToeChip, Player>> extends true ? `${Exclude<TicTacToeChip, Player>} Won`
        : IsGameOver<Result> extends true ? "Draw" : Exclude<TicTacToeChip, Player>
    }
    : never
    : { board: Deserialize<Game>, state: Player }

type TicTacToe<G extends Game, P extends TicTacToePosition> = PlaySerializedGame<Serialize<G["board"]>, G["state"], P>

// playground
type Res1 = TicTacToe<NewGame, "top-center">

type XLooserBoard = [
    ['⭕', '❌', '  '],
    ['⭕', '❌', '❌'],
    ['❌', '⭕', '  '],
]
type XEndGame = {
    board: XLooserBoard
    state: '❌'
}

type Res2 = TicTacToe<XEndGame, "top-right"> // X wins

type YLooserBoard = [
    ['⭕', '❌', '  '],
    ['⭕', '❌', '❌'],
    ['❌', '⭕', '  '],
]
type YEndGame = {
    board: YLooserBoard
    state: '⭕'
}

type Res3 = TicTacToe<YEndGame, "top-right">
type Res4 = TicTacToe<Res3, "bottom-right"> // Draw
