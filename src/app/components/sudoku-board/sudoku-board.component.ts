import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sudoku-board',
  templateUrl: './sudoku-board.component.html',
  styleUrls: ['./sudoku-board.component.scss']
})
export class SudokuBoardComponent implements OnInit {
  board: Array<Array<number>> = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  available: Array<Array<Set<number>>> = [
    [], [], [], [], [], [], [], [], []
  ];

  constructor() { }

  ngOnInit() {
    this.loadSample();
    this.calcAvailabe();
  }

  loadSample() {
    this.board = [
      [4, 2, 7, 1, 0, 0, 0, 6, 8],
      [0, 0, 5, 0, 0, 6, 3, 0, 0],
      [6, 0, 3, 0, 0, 0, 1, 0, 0],
      [2, 0, 0, 0, 1, 0, 4, 0, 0],
      [3, 4, 0, 0, 6, 7, 0, 5, 1],
      [8, 0, 1, 0, 5, 0, 0, 2, 0],
      [0, 9, 0, 0, 0, 0, 7, 3, 0],
      [7, 0, 4, 3, 0, 0, 2, 0, 9],
      [0, 3, 2, 0, 9, 4, 6, 0, 0]
    ];

    // this.board = [
    //   [0, 1, 0, 0, 2, 3, 6, 0, 7],
    //   [0, 0, 0, 0, 0, 0, 9, 0, 0],
    //   [6, 0, 0, 0, 0, 0, 2, 5, 0],
    //   [0, 0, 4, 1, 0, 2, 5, 3, 8],
    //   [0, 0, 2, 8, 0, 0, 4, 0, 0],
    //   [5, 0, 8, 0, 0, 0, 0, 6, 0],
    //   [8, 0, 0, 2, 0, 9, 0, 0, 0],
    //   [0, 0, 9, 0, 0, 0, 0, 0, 6],
    //   [0, 0, 0, 7, 3, 0, 0, 0, 0]
    // ]
  }

  calcAvailabe() {
    // Step 1 - trivial checks
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j] === 0) {
          this.available[i][j] = new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]);

          // Rows
          const rowValues = new Set<number>(this.board[i]);
          this.available[i][j] = new Set<number>([...this.available[i][j]].filter(x => !rowValues.has(x)));

          // Columns
          const colValues = new Set<number>();
          for (let row = 0; row < 9; row++) {
            colValues.add(this.board[row][j]);
          }
          this.available[i][j] = new Set<number>([...this.available[i][j]].filter(x => !colValues.has(x)));

          // Boxes
          const boxValues = new Set<number>();
          const rowOffset = Math.floor(i / 3);
          const colOffset = Math.floor(j / 3);
          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
              boxValues.add(this.board[rowOffset * 3 + row][colOffset * 3 + col]);
            }
          }
          this.available[i][j] = new Set<number>([...this.available[i][j]].filter(x => !boxValues.has(x)));
        }
      } 
    }

    // Step 2 - cleanup
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j] === 0) {
          // Rows exact pairs
          const pairs = this.available[i].filter(x => x.size === 2);
          const pairKeys = [...new Set<string>(pairs.map(x => [...x].join(',')))];
          const pairMap = new Map<string, number>(); // pair -> count

          for (const pair of pairs) {
            const pairKey = [...pair].join(',');

            if (pairKey in pairMap) {
              pairMap[pairKey]++;
            } else {
              pairMap[pairKey] = 1;
            }
          }

          console.log(pairs);

          const matchedPairValues = new Set<number>();
          for (const pair of pairs) {
            const pairKey = [...pair].join(',');

            if (pairMap[pairKey] === 2) {
              [...pair].forEach(x => {
                matchedPairValues.add(x)
              });
            }
          }

          if (matchedPairValues.size > 0) {
            this.available[i].forEach(x => console.log('>', x));

            this.available[i].forEach(x => {
              console.log(':', x);
              for (const pairKey of pairKeys) {
                console.log('pk>', pairKey, '_', [...x].join(','));
                if (pairKey !== [...x].join(',')) {
                  console.log('1>', pairKey, x, matchedPairValues);
                  matchedPairValues.forEach(y => x.delete(y));
                }
              }
            });

            this.available[i].forEach(x => console.log('>>', x));

            console.log(pairs);
          }
        }
      }
    }
  }

  stepSolve() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j] === 0 && this.available[i][j].size === 1) {
          this.board[i][j] = [...this.available[i][j]][0];
          delete this.available[i][j];
        }
      }
    }

    this.calcAvailabe();
  }
}
