enum Player {
  Max,
  Min,
}

enum Mark {
  Empty = "",
  X = "X",
  O = "O",
}

export enum Action {
  Mark0 = 0,
  Mark1,
  Mark2,
  Mark3,
  Mark4,
  Mark5,
  Mark6,
  Mark7,
  Mark8
}

type ActionStrings = keyof typeof Action

function arrayEquals(a: Array<Object>, b: Array<Object>): boolean {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

export class State extends Array<Mark> {
  static initial(): State {
    return new State(9).fill(Mark.Empty);
  }

  private player(): Player {
    const xCount = this.filter(m => m == Mark.X).length;
    const oCount = this.filter(m => m == Mark.O).length;

    if (xCount === oCount) {
      return Player.Max;
    }

    return Player.Min;
  }

  private actions(): Array<Action> {
    const legalActions = Array<Action>();

    this.forEach((mark, index) => {
      if (mark === Mark.Empty) {
	legalActions.push(Action[Action[index] as ActionStrings]);
      }
    });

    return legalActions;    
  }

  result(action: Action): State {
    const nextState = this.slice();

    if (this.player() === Player.Max) {
      nextState[action] = Mark.X;
    } else {
      nextState[action] = Mark.O;
    }

    return new State(...nextState);
  }

  private mark(mark: Mark, n: number): number {
    if (mark === Mark.Empty) {
      throw RangeError('invalid `mark`');
    }

    if (n < 1 || n > 3) {
      throw  RangeError('`n` not between 1 and 3');
    }

    const haystacks: Array<Array<Mark>> = [
      [0, 1, 2],
      [3 ,4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ].map((haystack) => haystack.map((index) => this[index]));

    let count = 0;
    let needles: Array<Array<Mark>>;

    if (n === 1) {
      needles = [
	[mark, Mark.Empty, Mark.Empty],
	[Mark.Empty, mark, Mark.Empty],
	[Mark.Empty, Mark.Empty, mark]
      ]
    } else if (n === 2) {
      needles = [
	[mark, mark, Mark.Empty],
	[mark, Mark.Empty, mark],
	[Mark.Empty, mark, mark]
      ];
    } else {
      needles = [
	[mark, mark, mark]
      ];
    }
    
    haystacks.forEach((h) => {
      needles.forEach((n) => {
	if (arrayEquals(h, n)) {
	  count++;
	}
      });
    });

    return count;
  }

  private x(n: number): number {
    return this.mark(Mark.X, n);
  }

  private o(n: number): number {
    return this.mark(Mark.O, n);
  }

  isTerminal(): boolean {
    if (this.find((m) => m === Mark.Empty) === undefined) {
      return true;
    }

    if (this.x(3) === 1 || this.o(3) === 1) {
      return true;
    }

    return false;
  }

  private utility(): number {
    if (this.x(3) === 1) {
      return 1;
    }

    if (this.o(3) === 1) {
      return -1;
    }

    if (this.isTerminal()) {
      return 0;
    }

    return (3 * this.x(2) + this.x(1)) - (3 * this.o(2) - this.o(1));
  }

  decision(): Action {
    if (this.isTerminal()) {
      throw Error('no more decisions available');
    }

    const actionValues = new Map<Action, number>;
    let minimax: number;

    if (this.player() == Player.Max) {
      this.actions().forEach((action) => {
	actionValues.set(action, State.minValue(this.result(action)));
      });

      minimax = Math.max(...Array.from(actionValues.values()));
    } else {
      this.actions().forEach((action) => {
	actionValues.set(action, State.maxValue(this.result(action)));
      });

      minimax = Math.min(...Array.from(actionValues.values()));
    }

    const decisions: Array<Action> = Array.from(actionValues.entries())
      .filter(([key, value]) => value === minimax)
      .map(([key]) => key);

    const randomIndex = Math.floor(Math.random() * decisions.length);

    return decisions[randomIndex];
  }

  private static maxValue(state: State): number {
    if (state.isTerminal()) {
      return state.utility();
    }

    const values = Array<number>();

    state.actions().forEach((action) => {
      values.push(State.minValue(state.result(action)));
    });

    return Math.max(...values);
  }

  private static minValue(state: State): number {
    if (state.isTerminal()) {
      return state.utility();
    }

    const values = Array<number>();

    state.actions().forEach((action) => {
      values.push(State.maxValue(state.result(action)));
    });

    return Math.min(...values);
  }
}
