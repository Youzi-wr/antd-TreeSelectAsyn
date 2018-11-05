import React from "react";
import ReactDOM from "react-dom";
import { TreeSelect, Tree, Menu, Dropdown, Icon } from "antd";
import data from "./data.js";
import "antd/dist/antd.css";

const TreeNode = Tree.TreeNode;

export class TreeSelectAsyn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: []
    };
  }
  componentDidMount() {
    let that = this;

    setTimeout(res => {
      let treeData = data.getRootNode;
      let orgList = [];

      treeData.map((item, i) => {
        !i
          ? orgList.push({
              title: item.name,
              key: "0",
              value: item.id,
              children: []
            })
          : orgList[0].children.push(
              !item.hasChild
                ? {
                    title: item.name,
                    key: "0-" + (i - 1),
                    value: item.id,
                    isLeaf: true
                  }
                : {
                    title: item.name,
                    key: "0-" + (i - 1),
                    value: item.id
                  }
            );
      });

      that.setState({
        treeData: orgList
      });
    }, 1000);
  }
  onLoadData(treeNode) {
    let parentId = treeNode.props.value;
    return new Promise(resolve => {
      setTimeout(res => {
        let dd = this.getNewTreeData(
          parentId,
          this.generateTreeNodes(treeNode, data[parentId])
        );
        let newData = JSON.stringify(dd);

        this.setState({
          treeData: JSON.parse(newData)
        });
        resolve();
      }, 1000);
    });
  }
  generateTreeNodes(treeNode, newChilds) {
    let newChildsList = [];

    newChilds.forEach((item, i) => {
      newChildsList.push({
        title: item.name,
        key: treeNode.props.eventKey + "-" + i,
        value: item.id,
        isLeaf: item.hasChild ? false : true
      });
    });

    return newChildsList;
  }
  getNewTreeData(curKey, child) {
    let { treeData } = this.state;

    const loop = data => {
      data.forEach(item => {
        if (curKey === item.value) {
          item.children = child;
          return;
        }
        if (item.children) {
          loop(item.children);
        }
      });
    };
    loop(treeData);

    return treeData;
  }
  render() {
    let { treeData } = this.state;
    let { isDisabled, id, name, placeholder } = this.props;

    let initData = {
      value: id ? id : "",
      label: name
    };

    return (
      <TreeSelect
        disabled={isDisabled}
        labelInValue
        value={initData}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        treeData={treeData}
        treeDefaultExpandedKeys={["0"]}
        loadData={e => this.onLoadData(e)}
        onChange={e => this.props.treeValueChange(e)}
      />
    );
  }
}

export class TreeAsyn extends React.Component {
  state = {
    expandedKeys: ["0"],
    treeData: []
  };
  componentDidMount() {
    this.initTree();
  }
  initTree() {
    setTimeout(res => {
      let treeData = res.data;
      let orgList = [];

      treeData.map((item, i) => {
        !i
          ? orgList.push({
              title: item.name,
              key: "0",
              value: item.id,
              children: []
            })
          : orgList[0].children.push(
              !item.hasChild
                ? {
                    title: item.name,
                    key: "0-" + (i - 1),
                    value: item.id,
                    isLeaf: true
                  }
                : {
                    title: item.name,
                    key: "0-" + (i - 1),
                    value: item.id
                  }
            );
      });

      this.setState({
        treeData: orgList
      });
    });
  }
  onLoadData = treeNode => {
    let parentId = treeNode.props.value;
    return new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }

      setTimeout(res => {
        if (res.success) {
          let dd = this.generateTreeNodes(treeNode, data[parentId]);
          let newData = JSON.stringify(dd);
          treeNode.props.dataRef.children = JSON.parse(newData);

          this.setState({
            treeData: [...this.state.treeData]
          });
        }
        resolve();
      });
    });
  };
  generateTreeNodes(treeNode, newChilds) {
    let newChildsList = [];

    newChilds.forEach((item, i) => {
      newChildsList.push({
        title: item.name,
        key: treeNode.props.eventKey + "-" + i,
        value: item.id,
        isLeaf: item.hasChild ? false : true
      });
    });

    return newChildsList;
  }
  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });
  };
  onExpand = (e, expandedKeys) => {
    this.setState({
      expandedKeys: e
    });
  };
  refreshTree = () => {
    this.setState({ treeData: [] });
    this.initTree();
  };
  // ------------- treeRightClick start --------------
  componentWillUnmount() {
    if (this.cmContainer) {
      ReactDOM.unmountComponentAtNode(this.cmContainer);
      document.body.removeChild(this.cmContainer);
      this.cmContainer = null;
    }
  }
  onRightClick = info => {
    this.renderCm(info);
  };
  renderCm(info) {
    if (this.toolTip) {
      ReactDOM.unmountComponentAtNode(this.cmContainer);
      this.toolTip = null;
    }

    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a
            href="javascript:;"
            onClick={e => this.props.add(info.node.props.dataRef)}
          >
            新增
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1">
          <a
            href="javascript:;"
            onClick={e => this.props.creat(info.node.props.dataRef)}
          >
            创建
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="2">
          <a
            href="javascript:;"
            onClick={e => this.props.edit(info.node.props.dataRef)}
          >
            重命名
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">
          <a
            href="javascript:;"
            onClick={e => this.props.move(info.node.props.dataRef)}
          >
            移动
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="4">
          <a
            href="javascript:;"
            onClick={e => this.props.delete(info.node.props.dataRef)}
          >
            删除
          </a>
        </Menu.Item>
      </Menu>
    );

    this.toolTip = (
      <Dropdown
        overlay={menu}
        defaultVisible
        trigger={["click"]}
        placement="bottomLeft"
      >
        <span />
      </Dropdown>
    );

    const container = this.getContainer();
    Object.assign(this.cmContainer.style, {
      position: "absolute",
      left: `${info.event.pageX}px`,
      top: `${info.event.pageY}px`
    });

    ReactDOM.render(this.toolTip, container);
  }
  getContainer() {
    if (!this.cmContainer) {
      this.cmContainer = document.createElement("div");
      document.body.appendChild(this.cmContainer);
    }
    return this.cmContainer;
  }
  // ------------- treeRightClick end --------------
  render() {
    let { expandedKeys } = this.state;
    let { isRightClick } = this.props;
    let ex = JSON.parse(JSON.stringify(expandedKeys));

    return (
      <div>
        {this.state.treeData.length ? (
          <Tree
            loadData={this.onLoadData}
            onExpand={this.onExpand}
            expandedKeys={ex}
            onRightClick={isRightClick ? this.onRightClick : null}
            onSelect={(e, infos) => this.props.treeValueChange(e, infos)}
          >
            {this.renderTreeNodes(this.state.treeData)}
          </Tree>
        ) : (
          <Icon type="loading" theme="outlined" />
        )}
      </div>
    );
  }
}

// export default {
//   TreeSelectAsyn,
//   TreeAsyn
// };
