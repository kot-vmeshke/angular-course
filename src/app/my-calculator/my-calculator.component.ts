import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

interface CalcGroup {
  first: CalcVar;
  second: CalcVar;
  operation: CalcOperations;
}
interface CalcVar {
  value: number;
  modificator: CalcModifiers;
}
enum CalcOperations {
  plus = '+',
  minus = '-',
  multiply = '×',
  divide = '/',
}
enum CalcModifiers {
  none = 'none',
  sin = 'sin',
  cos = 'cos',
  square = 'square',
}

@Component({
  selector: 'app-my-calculator',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './my-calculator.component.html',
  styleUrl: './my-calculator.component.scss',
})
export class MyCalculatorComponent {
  public result: number | undefined = undefined;

  public CalcOperations = CalcOperations;
  public CalcModifiers = CalcModifiers;

  public calcGroups: CalcGroup[] = [
    {
      first: {
        value: 5,
        modificator: CalcModifiers.none,
      },
      second: {
        value: 5,
        modificator: CalcModifiers.none,
      },
      operation: CalcOperations.plus,
    },
  ];

  public history: string[] = [];

  public operationsBetweenGrouops: CalcOperations[] = [];

  public addGroup(): void {
    this.calcGroups.push({
      first: {
        value: 0,
        modificator: CalcModifiers.none,
      },
      second: {
        value: 0,
        modificator: CalcModifiers.none,
      },
      operation: CalcOperations.plus,
    });
    this.operationsBetweenGrouops.push(CalcOperations.plus);
  }

  public removeGroup(index: number): void {
    this.calcGroups.splice(index, 1);
    this.operationsBetweenGrouops.splice(index - 1, 1);
  }

  public calcGroup() {
    let result: number = 0;
    let tempHistory: string[] = [];

    this.calcGroups.forEach((group, index) => {
      if (index === 0) {
        result = this.calc(
          this.calcValueWithMod(group.first),
          this.calcValueWithMod(group.second),
          group.operation
        );
      } else {
        let tempResult = this.calc(
          this.calcValueWithMod(group.first),
          this.calcValueWithMod(group.second),
          group.operation
        );
        result = this.calc(
          result,
          tempResult,
          this.operationsBetweenGrouops[index - 1]
        );
        tempHistory.push(this.operationsBetweenGrouops[index - 1]);
      }
      tempHistory.push(
        `(
        ${
          group.first.modificator !== CalcModifiers.none
            ? group.first.modificator
            : ''
        } 
        ${group.first.value}
        ${group.operation}
        ${
          group.second.modificator !== CalcModifiers.none
            ? group.second.modificator
            : ''
        }
        ${group.second.value}
        )`
      );
    });

    tempHistory.push(`= ${result}`);

    this.result = result;
    this.history.push(tempHistory.join(' '));
  }

  public calcValueWithMod(value: CalcVar): number {
    switch (value.modificator) {
      case CalcModifiers.cos:
        return Math.cos(value.value);
      case CalcModifiers.sin:
        return Math.sin(value.value);
      case CalcModifiers.square:
        return Math.pow(value.value, 2);
      case CalcModifiers.none:
        return value.value;
    }
  }

  public calc(
    first: number,
    second: number,
    operation: CalcOperations
  ): number {
    switch (operation) {
      case CalcOperations.plus:
        return first + second;
      case CalcOperations.minus:
        return first - second;
      case CalcOperations.multiply:
        return first * second;
      case CalcOperations.divide:
        return first / second;
    }
  }
}
