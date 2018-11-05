import React from "react";
import ReactDOM from "react-dom";
import { TreeSelectAsyn } from "./ext.js";
import style from "./index.scss";
const sty = style;

class Client extends React.Component {
  state = {
    id: "1-1",
    name: "leval1-1"
  };
  getTreeValue(e) {
    console.log(e);
    this.setState({
      id: e.value,
      name: e.name
    });
  }
  render() {
    let { id, name } = this.state;
    return (
      <div className={sty.client}>
        <TreeSelectAsyn
          isDisabled={false}
          id={id}
          name={name}
          treeValueChange={e => this.getTreeValue(e)}
        />
      </div>
    );
  }
}

ReactDOM.render(<Client />, document.getElementById("container"));
