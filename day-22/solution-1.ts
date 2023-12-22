/** because "dashing" implies speed */
type Dasher = '💨';

/** representing dancing or grace */
type Dancer = '💃';

/** a deer, prancing */
type Prancer = '🦌';

/** a star for the dazzling, slightly mischievous Vixen */
type Vixen = '🌟';

/** for the celestial body that shares its name */
type Comet = '☄️';

/** symbolizing love, as Cupid is the god of love */
type Cupid = '❤️';

/** representing thunder, as "Donner" means thunder in German */
type Donner = '🌩️';

/** meaning lightning in German, hence the lightning bolt */
type Blitzen = '⚡';

/** for his famous red nose */
type Rudolph = '🔴';

type Reindeer = Dasher | Dancer | Prancer | Vixen | Comet | Cupid | Donner | Blitzen | Rudolph;

type HasAll<T extends string> = Exclude<Reindeer, T> extends never ? true : false
type AllTrue<T extends any[]> = T extends [infer B, ...infer R] ? (B | AllTrue<R>) extends true ? true : false : never
type Flatten<T> = T extends [infer T extends any[], ...infer R extends any[][]] ? [...T, ...Flatten<R>] : []
type Next<T, Acc extends any[] = []> = Acc["length"] extends T ? [...Acc, 0]["length"] : Next<T, [...Acc, 0]>
type ResetWhen<T extends number, U extends number> = T extends U ? 0 : T
type JoinAt<T extends any[][], U extends any[], I extends number> = { [K in keyof T]: `${I}` extends K ? [...T[K], ...U] : T[K] }
type FillArr<T, Length, Acc extends T[] = []> = Length extends Acc["length"] ? Acc : FillArr<T, Length, [...Acc, T]>

type GetColumns<
    T extends string[],
    Index extends number = 0,
    Acc extends string[][] = FillArr<[], 9>,
> = T extends [infer First extends string, ...infer Rest extends string[]]
    ? GetColumns<Rest, ResetWhen<Next<Index>, 9>, JoinAt<Acc, [First], Index>>
    : Acc

type GetRegions<
    T extends string[][],
    Index extends number = 0,
    Buf extends string[][] = FillArr<[], 3>,
    Acc extends string[][] = [],
> = T extends [infer First extends string[], ...infer Rest extends string[][]]
    ? Buf[2][8] extends undefined // check if buffer is full
    ? GetRegions<Rest, ResetWhen<Next<Index>, 3>, JoinAt<Buf, First, Index>, Acc>
    : GetRegions<Rest, ResetWhen<Next<Index>, 3>, JoinAt<FillArr<[], 3>, First, 0>, [...Acc, ...Buf]> // transfer and reset buffer
    : [...Acc, ...Buf]

type CheckRows<T extends Reindeer[][][]> = { [K in keyof T]: HasAll<Flatten<T[K]>[number]> }[number]
type CheckColumns<T extends Reindeer[][][]> = GetColumns<Flatten<Flatten<T>>> extends infer Columns extends string[][] ?
    { [K in keyof Columns]: HasAll<Columns[K][number]> }[number]
    : false
type CheckRegions<T extends Reindeer[][][]> = GetRegions<Flatten<T>> extends infer Regions extends string[][] ?
    { [K in keyof Regions]: HasAll<Regions[K][number]> }[number]
    : false

export type Validate<T extends Reindeer[][][]> = AllTrue<[CheckRows<T>, CheckColumns<T>, CheckRegions<T>]>;
