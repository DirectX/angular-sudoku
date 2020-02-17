import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SudokuBoardComponent } from './sudoku-board.component';

describe('SudokuBoardComponent', () => {
  let component: SudokuBoardComponent;
  let fixture: ComponentFixture<SudokuBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SudokuBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SudokuBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
