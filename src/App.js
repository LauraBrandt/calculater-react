import React, { Component } from 'react';
import './App.css';

const buttons = [
  {id: "power",     value: 'On/Off',                  type: 'power'},
  {id: "clear",     value: 'C',                       type: 'clear'},
  {id: "backspace", value: String.fromCharCode(9003), type: 'backspace'},
  {id: "divide",    value: '/',                       type: 'operator'},
  {id: "seven",     value: '7',                       type: 'number'},
  {id: "eight",     value: '8',                       type: 'number'},
  {id: "nine",      value: '9',                       type: 'number'},
  {id: "multiply",  value: String.fromCharCode(215),  type: 'operator'},
  {id: "four",      value: '4',                       type: 'number'},
  {id: "five",      value: '5',                       type: 'number'},
  {id: "six",       value: '6',                       type: 'number'},
  {id: "subtract",  value: '-',                       type: 'operator'},
  {id: "one",       value: '1',                       type: 'number'},
  {id: "two",       value: '2',                       type: 'number'},
  {id: "three",     value: '3',                       type: 'number'},
  {id: "add",       value: '+',                       type: 'operator'},
  {id: "zero",      value: '0',                       type: 'number'},
  {id: "sign",      value: '+/-',                     type: 'sign'},
  {id: "decimal",   value: '.',                       type: 'decimal'},
  {id: "equals",    value: '=',                       type: 'equals'},
]

const Display = (props) => {
  return (
    <div id="display-container">
      <p id="calculation">{props.calculation}</p>
      <p id="display">{props.result}</p>
    </div>
  );
}

const Button = (props) => {
  return (
    <button 
    className={`button ${props.button.type}`} 
    id={props.button.id} 
    onClick={(e) => props.onClick(e, props.button)}
    style={{gridArea: props.button.id}}
    >
      {props.button.value}
    </button>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: buttons,
      result: "0",
      calculation: "",
      power: true,
      reset: false,
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount(){
    document.addEventListener("keydown", this.handleKeyPress, false);
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.handleKeyPress, false);
  }

  handleClick(e, button) {
    if (button.type === "power") {
      this.setState((previousState, currentProps) => ({
        power: !previousState.power,
        result: previousState.power ? "" : "0",
        calculation: "",
        reset: false
      }));
    }
    if (this.state.power) {
      switch (button.type) {
        case "clear":
          this.handleClear();
          break;
        case "number":
          this.handleNumber(button.value);
          break;
        case "decimal":
          this.handleDecimal(button.value);
          break;
        case "operator":
          this.handleOperator(button.value);
          break;
        case "equals":
          this.handleEquals(button.value);
          break;
        case "backspace": 
          this.handleBackspace();
          break;
        case "sign":
          this.handleSign();
          break;
        default:
          break;
      }
    }
  }

  handleKeyPress(e) {
    switch(e.key) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "0":
        this.handleNumber(e.key);
        break;
      case ".":
        this.handleDecimal(e.key);
        break;
      case "+":
      case "-":
      case "/":
        this.handleOperator(e.key);
        break;
      case "*":
        this.handleOperator(String.fromCharCode(215));
        break;
      case "=":
      case "Enter":
        e.preventDefault();
        this.handleEquals("=");
        break;
      case "Backspace": 
        this.handleBackspace();
        break;
      default:
        break;
    }
  }

  handleClear() {
    this.setState({
      calculation: "",
      result: "0",
      reset: false
    });
  }

  handleNumber(value) {
    if (this.state.reset) {
      this.setState((previousState, currentProps) => ({
        result: previousState.result === "0" ? "0" : value,
        calculation: "",
        reset: false,
      }));
    } else {
        this.setState((previousState, currentProps) => ({
          result: previousState.result === "0" ? value : previousState.result + value,
        }));
    }
  }

  handleDecimal(value) {
    if (this.state.reset) {
      this.setState((previousState, currentProps) => ({
        result: `0${value}`,
        calculation: "",
        reset: false,
      }));
    } else {
      this.setState((previousState, currentProps) => ({
        result: previousState.result.indexOf('.') !== -1 ? 
                previousState.result :
                !previousState.result ? 
                `0${value}` :
                previousState.result + value,
      }));
    }
  }

  handleOperator(value) {
    if (this.state.reset) {
      this.setState((previousState, currentProps) => ({
        result: "0",
        calculation: `${previousState.result} ${value}`,
        reset: false,
      }));
    } else {
      this.setState((previousState, currentProps) => ({
        calculation: 
          (['-', '+', '/', String.fromCharCode(215)].includes(previousState.calculation.slice(-1)) && !previousState.result) ? 
          `${previousState.calculation.slice(0, -1)} ${previousState.result} ${value}` : 
          `${previousState.calculation} ${previousState.result} ${value}`,
        result: "0"
      }));
    }
  }

  handleEquals(value) {
    if (!this.state.reset) {
      const newCalc = (['-', '+', '/', String.fromCharCode(215)].includes(this.state.calculation.slice(-1)) && !this.state.result) ? 
        `${this.state.calculation.slice(0, -1)} ${this.state.result}` : 
        `${this.state.calculation} ${this.state.result}`;
      const re = new RegExp(String.fromCharCode(215),"g");            // eslint-disable-next-line
      const newResult = (+parseFloat(eval(newCalc.replace(re, '*'))).toFixed(10)).toString()
      this.setState((previousState, currentProps) => ({
        calculation: `${newCalc}  ${value}`,
        result: newResult,
        reset: true,
      }));
    }
  }

  handleBackspace() {
    this.setState((previousState, currentProps) => ({
      result: previousState.result.length > 1 ? 
              previousState.result.slice(0,-1) : 
              previousState.result.length === 1 ? 
              "0" : 
              ""                  
    }));
  }

  handleSign() {
    this.setState((previousState, currentProps) => ({
      result: !previousState.result || previousState.result === "0" ? 
              previousState.result : 
              previousState.result.slice(0, 1) === '-' ?
              previousState.result.slice(1) : 
              '-' + previousState.result
    }));
  }

  render() {
    return (
      <div id="calculator">
        <Display result={this.state.result} calculation={this.state.calculation} />
        {
          this.state.buttons.map( button => 
          <Button 
            button={button} 
            key={button.id}
            onClick={this.handleClick}
          /> )
        }
      </div>
    );
  }
}

export default App;
