import React from "react";
import TileC from "./Tile";

export enum Color {
  EMPTY,
  WHITE,
  BLACK,
}

export interface Tile {
  i: number;
  state: Color;
  x: number;
  y: number;
  handlers: OnClickRegister[];
}

interface OnClickRegisterData {
  i: number;
  newState: number;
}

type OnClickRegister = (data: OnClickRegisterData) => void;
type OnWinRegister = (winner: Color) => void;

export default class Manager {
  static instance: Manager | undefined = undefined;
  onWinHandlers: OnWinRegister[] = [];
  tiles: Tile[] = [];
  w: number;
  h: number;

  L: number;
  R: number;
  U: number;
  D: number;

  initialMove: boolean = true;

  winner: Color = Color.EMPTY;
  turn: Color = Color.WHITE;

  constructor() {
    if (!Manager.instance) {
      Manager.instance = this;
    }

    this.w = 13;
    this.h = 13;

    this.L = -1;
    this.R = 1;
    this.U = -this.w;
    this.D = this.w;

    this.init();
  }

  init() {
    this.tiles = [];
    for (let i = 0; i < this.w * this.h; i++) {
      this.tiles.push({
        i,
        state: Color.EMPTY,
        x: Math.floor(i / this.w),
        y: i % this.h,
        handlers: [],
      });
    }
  }

  touchingLeftEdge(pos: number) {
    return pos % this.w === 0;
  }
  touchingRightEdge(pos: number) {
    return (pos - this.w + 1) % this.w === 0;
  }
  touchingTopEdge(pos: number) {
    return pos < this.w;
  }

  touchingBottomEdge(pos: number) {
    return pos >= this.w * this.h - this.w;
  }

  touchingTopLeftEdge(pos: number) {
    return this.touchingTopEdge(pos) || this.touchingLeftEdge(pos);
  }
  touchingTopRightEdge(pos: number) {
    return this.touchingTopEdge(pos) || this.touchingRightEdge(pos);
  }
  touchingBottomLeftEdge(pos: number) {
    return this.touchingBottomEdge(pos) || this.touchingLeftEdge(pos);
  }
  touchingBottomRightEdge(pos: number) {
    return this.touchingBottomEdge(pos) || this.touchingRightEdge(pos);
  }

  checkAxis(
    pos: number,
    dir1: number,
    dir2: number,
    touching1: (pos: number) => boolean,
    touching2: (pos: number) => boolean
  ) {
    var amount = 1;
    for (let i = 0; i < 3; i++) {
      if (
        !touching1(pos + dir1 + dir1 * (i - 1)) &&
        this.tiles[pos + dir1 + dir1 * i] &&
        this.tiles[pos + dir1 + dir1 * i].state === this.turn
      ) {
        amount += 1;
      } else {
        break;
      }
    }
    for (let i = 0; i < 3; i++) {
      if (
        !touching2(pos + dir2 + dir2 * (i - 1)) &&
        this.tiles[pos + dir2 + dir2 * i] &&
        this.tiles[pos + dir2 + dir2 * i].state === this.turn
      ) {
        amount += 1;
      } else {
        break;
      }
    }
    return amount >= 4;
  }

  checkWin(pos: number) {
    if (
      this.checkAxis(
        pos,
        this.L,
        this.R,
        this.touchingLeftEdge.bind(this),
        this.touchingRightEdge.bind(this)
      )
    ) {
      return true;
    }
    if (
      this.checkAxis(
        pos,
        this.U,
        this.D,
        this.touchingRightEdge.bind(this),
        this.touchingBottomEdge.bind(this)
      )
    ) {
      return true;
    }
    if (
      this.checkAxis(
        pos,
        this.L + this.U,
        this.R + this.D,
        this.touchingTopLeftEdge.bind(this),
        this.touchingBottomRightEdge.bind(this)
      )
    ) {
      return true;
    }
    if (
      this.checkAxis(
        pos,
        this.L + this.D,
        this.R + this.U,
        this.touchingBottomLeftEdge.bind(this),
        this.touchingTopRightEdge.bind(this)
      )
    ) {
      return true;
    }
    return false;
  }

  place(i: number) {
    this.initialMove = false;
    // Send out to handlers
    this.tiles[i].state = this.turn;
    this.tiles[i].handlers.forEach((handler) => {
      handler({ i: i, newState: this.turn });
    });

    if (this.checkWin(i)) {
      this.winner = this.turn;
      this.onWinHandlers.forEach((handler) => {
        handler(this.turn);
      });
    }

    this.turn = this.turn === Color.WHITE ? Color.BLACK : Color.WHITE;
  }

  onClickTile(i: number) {
    if (this.winner !== Color.EMPTY) {
      return;
    }

    if (this.tiles[i].state !== Color.EMPTY) {
      return;
    }

    if (!this.initialMove) {
      if (!this.checkMove(i)) {
        return;
      }
    }

    this.place(i);
  }

  registerClick(i: number, handler: OnClickRegister) {
    this.tiles[i]!.handlers.push(handler);
  }

  registerWin(handler: OnWinRegister) {
    this.onWinHandlers.push(handler);
  }

  checkMove(i: number) {
    if (
      this.tiles[i + this.L] &&
      !this.touchingLeftEdge(i) &&
      this.tiles[i + this.L].state !== Color.EMPTY
    ) {
      return true;
    }
    if (
      this.tiles[i + this.R] &&
      !this.touchingRightEdge(i) &&
      this.tiles[i + this.R].state !== Color.EMPTY
    ) {
      return true;
    }
    if (
      this.tiles[i + this.U] &&
      !this.touchingTopEdge(i) &&
      this.tiles[i + this.U].state !== Color.EMPTY
    ) {
      return true;
    }
    if (
      this.tiles[i + this.D] &&
      !this.touchingBottomEdge(i) &&
      this.tiles[i + this.D].state !== Color.EMPTY
    ) {
      return true;
    }
    return false;
  }

  createTiles(): React.ReactNode {
    return (
      <div
        className="grid aspect-square portrait:w-full landscape:h-screen"
        style={{
          gridTemplateRows: `repeat(${this.w}, auto)`,
          gridTemplateColumns: `repeat(${this.h}, auto)`,
        }}
      >
        {this.tiles.map((tile) => {
          return (
            <TileC
              i={tile.i}
              other={tile.i % 2 === 0}
              state={Color.EMPTY}
              key={tile.i}
              onclick={(i) => this.onClickTile(i)}
            ></TileC>
          );
        })}
      </div>
    );
  }

  restart() {
    this.initialMove = true;
    this.winner = Color.EMPTY;
    this.turn = Color.WHITE;

    this.tiles.forEach((tile) => {
      tile.state = Color.EMPTY;
      tile.handlers.forEach((handler) => {
        handler({
          i: tile.i,
          newState: tile.state,
        });
      });
    });
  }
}
