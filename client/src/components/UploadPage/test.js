import React, { Component } from "react";
class Board extends Component {
  state = { input1: "", input2: "", list: [] };
  num = 0;
  //모든 input 제어
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  //추가 명령을 수행할 함수
  handleCreate = () => {
    const { input1, input2, list } = this.state;
    this.setState({
      list: list.concat({ input1: input1, input2: input2 }),
      input1: "",
      input2: "",
    });
  };
  render() {
    const { handleChange, handleCreate } = this;
    const { input1, input2, list } = this.state;
    return (
      <div>
        {" "}
        <div>
          {" "}
          <input
            type="text"
            name="input1"
            onChange={handleChange}
            value={input1}
          />{" "}
          <input
            type="text"
            name="input2"
            onChange={handleChange}
            value={input2}
          />{" "}
          <button onClick={handleCreate}>추가</button>{" "}
        </div>{" "}
        <div>
          {" "}
          <ul>
            {" "}
            {list.map((item, index) => {
              return (
                <li key={index}>
                  {" "}
                  {item.input1} / {item.input2}{" "}
                </li>
              );
            })}{" "}
          </ul>{" "}
        </div>{" "}
      </div>
    );
  }
}
export default Board;
