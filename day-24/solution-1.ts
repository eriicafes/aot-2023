type Alley = "  ";
type MazeItem = "🎄" | "🎅" | Alley;
type DELICIOUS_COOKIES = "🍪";
type MazeMatrix = MazeItem[][];
type Directions = "up" | "down" | "left" | "right";

type Skip<T extends any[], I extends number, $acc extends any[] = []> = $acc["length"] extends I
    ? T
    : T extends [infer $first, ...infer $rest] ? Skip<$rest, I, [...$acc, $first]> : []
type Pop<T extends any[], I extends number, $acc extends any[] = []> = T["length"] extends I
    ? $acc
    : T extends [infer $first, ...infer $rest] ? Pop<$rest, I, [...$acc, $first]> : []
type Last<T extends any[]> = T extends [...any[], infer $last] ? $last : T[0]
type Next<T, $acc extends any[] = []> = $acc["length"] extends T ? [...$acc, 0]["length"] : Next<T, [...$acc, 0]>
type Prev<T, $acc extends any[] = []> = $acc["length"] extends T
    ? $acc extends [...infer $prev, any] ? $prev["length"] : 0
    : Prev<T, [...$acc, 0]>
type FindIndex<T extends any[], U, $acc extends any[] = []> = T extends [infer $first, ...infer $rest]
    ? $first extends U ? $acc["length"] : FindIndex<$rest, U, [...$acc, $acc["length"]]>
    : undefined
type PlaceAtIndex<T extends any[], U, I extends number> = {
    [K in keyof T]: K extends `${I}` ? U : T[K]
}

type FillCookies<T extends MazeMatrix> = { [K in keyof T]: PlaceAtIndex<T[K], DELICIOUS_COOKIES, number> }
type MoveSantaToIndex<T extends any[], From extends number, To extends number> = T[To] extends Alley
    ? PlaceAtIndex<PlaceAtIndex<T, Alley, From>, "🎅", To>
    : T

export type Move<M extends MazeMatrix, D extends Directions | "inplace", $acc extends MazeMatrix = []> =
    M extends [infer $first extends MazeItem[], ...infer $rest extends MazeMatrix]
    ? FindIndex<$first, "🎅"> extends infer Index extends number
    ? Index extends 0 ? FillCookies<[...$acc, $first, ...$rest]>
    : D extends "left" ? [...$acc, MoveSantaToIndex<$first, Index, Prev<Index>>, ...$rest]
    : D extends "right" ? [...$acc, MoveSantaToIndex<$first, Index, Next<Index>>, ...$rest]
    : D extends "up" ? Last<$acc>[Index] extends Alley ? [
        ...Pop<$acc, 1>,
        PlaceAtIndex<Last<$acc>, "🎅", Index>,
        PlaceAtIndex<$first, Alley, Index>,
        ...$rest,
    ] : [...$acc, $first, ...$rest]
    : D extends "down" ? $rest[0][Index] extends Alley ? [
        ...$acc,
        PlaceAtIndex<$first, Alley, Index>,
        PlaceAtIndex<$rest[0], "🎅", Index>,
        ...Skip<$rest, 1>,
    ] : [...$acc, $first, ...$rest]
    : never
    : Move<$rest, D, [...$acc, $first]>
    : $acc
