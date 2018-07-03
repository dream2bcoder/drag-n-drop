import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition, transit } from "react-css-transition";

import { browser, startAnimation } from "./utility";

import "./styles.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: ["Hello", "World", "Click", "Me!"] };
    this.handleAdd = this.handleAdd.bind(this);
    this.browser = browser();
    this.dragSourceId = "";
    this.dragImageEl = null;
    this.targetEl = null;
  }

  handleAdd() {
    const newItems = this.state.items.concat([prompt("Enter some text")]);
    this.setState({ items: newItems });
  }

  handleRemove(i) {
    let newItems = this.state.items.slice();
    let ex = newItems.splice(i, 1);
    newItems.splice(i + 1, 0, ex);
    this.setState({ items: newItems });
  }

  getItemIndex(item) {
    let text = item.id.replace("item-", "");
    return isNaN(text) ? -1 : Number(text);
  }

  handleDragSource(e) {
    let el = e.target;
    if (!this.browser.isIE && !this.browser.isEdge) {
      if (!this.dragImageEl) {
        let node = el.cloneNode(true);
        document.body.appendChild(node);
        node.style.marginTop = "-99999px";
        e.dataTransfer.setDragImage(node, node.offsetWidth/2, node.offsetHeight/2);
        this.dragImageEl = node;
      }
      e.dataTransfer.setData("text/plain", e.target.id);
      el.style.opacity = 0.01;
    }
    this.dragSourceId = el.id;
  }

  handleSwap(e) {
    let targetIndex = this.getItemIndex(e.target),
      sourceIndex = Number(this.dragSourceId.replace("item-", ""));

    this.targetEl = e.target;

    if (
      targetIndex !== sourceIndex &&
      this.dragSourceId &&
      document.querySelector("#" + this.dragSourceId).parentElement !== e.target
    ) {
      let newItems = this.state.items.slice();
      let minIndex = targetIndex < sourceIndex ? targetIndex : sourceIndex;
      let maxIndex = targetIndex > sourceIndex ? targetIndex : sourceIndex;
      let min = newItems.splice(minIndex, 1);
      newItems.splice(maxIndex - 1, 0, min);
      let max = newItems.splice(maxIndex, 1);
      newItems.splice(minIndex, 0, max);
      this.dragSourceId = "item-" + targetIndex;
      this.targetEl.style.transform =
        "translateY(" +
        (targetIndex < sourceIndex ? 1 : -1) *
          (this.targetEl.clientHeight + 1) +
        "px)";
        startAnimation(() => {
          this.setState({items: newItems});
        });
      // setTimeout(() => {
      //   this.setState({ items: newItems });
      // }, 200);
    }
  }

  handleDropTarget(e) {
    let id = this.dragSourceId || e.dataTransfer.getData("text/plain");
    if (id) {
      let dragSource = document.querySelector("#" + id);
      dragSource.style.opacity = 1;
    }
    if (this.dragImageEl) {
      document.body.removeChild(this.dragImageEl);
      this.dragImageEl = null;
      this.targetEl = null;
    }
  }

  componentDidUpdate() {
    if (this.targetEl) {
      this.targetEl.style.transform = "none";
      this.targetEl = null;
    }
  }

  render() {
    const items = this.state.items.map((item, i) => (
      <div
        className="item"
        draggable
        id={"item-" + i}
        key={item}
        onDragStart={event => {
          this.handleDragSource(event);
        }}
        onDragOver={event => {
          event.preventDefault();
          this.handleSwap(event);
        }}
        onDrop={event => {
          this.handleDropTarget(event);
        }}
      >
        {item}
      </div>
    ));

    return (
      <div
        className="container"
        draggable
        onDragOver={event => event.preventDefault()}
        onDrop={event => this.handleDropTarget(event)}
      >
        <div className="wrapper">
          <button 
            className="addItem" 
            onClick={this.handleAdd}
          >
            Add Item
          </button>
          {items}
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
