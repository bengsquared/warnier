import React, { useRef, useEffect, useState, useCallback } from 'react';
import './App.css';



class Block extends React.Component {
    
    constructor(props) {
        super(props);
        if(!props.isChild){
            let name = "";
            let kids = [];
            if (props.title){
                name = props.title;
            } 
            if (props.children){
                kids = props.children;
            }
            this.state = {
              title:name,
              children:kids,
            };
        }
        this.blockRef = React.createRef();
    }
    
    componentDidMount() {
        if (this.props.shouldFocus) {
            this.blockRef.current?.focus();
        }
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.shouldFocus && !prevProps.shouldFocus) {
            this.blockRef.current?.focus();
        }
    }
    
    
    AddChild(){
        let currentChildren = [...(this.props.children || [])];
        let newID = create_UUID();
        let newprops = {
            id:newID,
            title:"new block",
            children:[]
        }
        currentChildren.push(newprops);
        if(!this.props.isChild){
            this.setState({
                children: currentChildren,
            }, () => {
                // Focus the new child
                if (this.props.onFocusNode) {
                    this.props.onFocusNode(newID);
                }
            });
        } else {
            this.props.NotifyParent(this.props.id, this.props.title, currentChildren);
            if (this.props.onFocusNode) {
                this.props.onFocusNode(newID);
            }
        }
    }

    AddSibling(){
        if (!this.props.isChild) {
            // Root node cannot have siblings, add child instead
            this.AddChild();
            return;
        }
        
        if (this.props.onAddSibling) {
            let newID = create_UUID();
            let newprops = {
                id: newID,
                title: "new block",
                children: []
            }
            this.props.onAddSibling(this.props.id, newprops);
        }
    }
    
    ChildChange(id,title,childArray){
        let children=[];
        if(!this.props.isChild){
            children = [...this.state.children];
        } else {
            children = [...this.props.children];
        }
        let j = children.length;
        for(var i = 0; i < j;i++){
            if (id === children[i].id){
                children[i]={
                    id:id,
                    title:title,
                    children:childArray
                }
                break;
            }
        }
            
        if(!this.props.isChild){
            this.setState({
                children:children,
            });
        } else {
            this.props.NotifyParent(this.props.id, this.props.title, children);
        }
    }

    handleKeyDown = (e) => {
        // Only handle keyboard shortcuts when this block is focused
        if (this.props.focusedNodeId !== this.props.id) {
            return;
        }

        // Ignore keyboard shortcuts if user is typing in input
        if (e.target.tagName === 'INPUT' && e.target === document.activeElement) {
            return;
        }

        if (e.key === 'Enter') {
            if (e.ctrlKey || e.metaKey) {
                // Ctrl/Cmd+Enter: Add child
                e.preventDefault();
                this.AddChild();
            } else {
                // Enter: Add sibling (or child if root)
                e.preventDefault();
                this.AddSibling();
            }
        }
    }

    handleFocus = () => {
        if (this.props.onFocusNode) {
            this.props.onFocusNode(this.props.id);
        }
    }

    handleTitleChange = (e) => {
        const newTitle = e.target.value;
        if (!this.props.isChild) {
            this.setState({ title: newTitle });
        } else {
            this.props.NotifyParent(this.props.id, newTitle, this.props.children);
        }
    }
    
    
    render(){
        let children = [];
        let title = "";
        if(!this.props.isChild){
            children = this.state.children;
            title = this.state.title;
        } else {
            children = this.props.children;
            title = this.props.title;
        }
        
        const isFocused = this.props.focusedNodeId === this.props.id;
        
        const kids = children.map((child) => 
            <Block 
                key={child.id} 
                id={child.id} 
                isChild={true} 
                children={child.children} 
                title={child.title} 
                focusedNodeId={this.props.focusedNodeId}
                onFocusNode={this.props.onFocusNode}
                onAddSibling={this.props.onAddSibling}
                NotifyParent={(id, title, childArray) => this.ChildChange(id, title, childArray)} 
            />
        );
        
        return(
            <div 
                className={`blockBox ${isFocused ? 'focused' : ''}`}
                ref={this.blockRef}
                tabIndex={0}
                onKeyDown={this.handleKeyDown}
                onFocus={this.handleFocus}
            >
                <div className="blockInfo">
                    <div className="blockTitle">
                        <input 
                            value={title || ''} 
                            onChange={this.handleTitleChange}
                            placeholder="Block title"
                        />
                    </div>
                </div>
                <div className="brace"> </div>
                
                <div className="children">
                    {kids}
                    <div className="addChild" onClick={() => this.AddChild()}>add child</div>
                </div>
            </div>
        );
    }
    
    
    
}



class App extends React.Component {
  constructor(props) {
    super(props);
    const rootId = create_UUID();
    this.state = {
      focusedNodeId: rootId,
      rootNode: {
        id: rootId,
        title: "Root",
        children: []
      }
    };
  }

  handleFocusNode = (nodeId) => {
    this.setState({ focusedNodeId: nodeId });
  }

  handleAddSibling = (afterNodeId, newNode) => {
    this.setState(prevState => {
      const updatedRoot = this.addSiblingToTree(prevState.rootNode, afterNodeId, newNode);
      return {
        rootNode: updatedRoot,
        focusedNodeId: newNode.id
      };
    });
  }

  handleRootUpdate = (id, title, children) => {
    this.setState(prevState => ({
      rootNode: {
        ...prevState.rootNode,
        title: title,
        children: children
      }
    }));
  }

  addSiblingToTree = (node, afterNodeId, newNode) => {
    if (node.children) {
      const childIndex = node.children.findIndex(child => child.id === afterNodeId);
      if (childIndex !== -1) {
        // Found the node, insert sibling after it
        const newChildren = [...node.children];
        newChildren.splice(childIndex + 1, 0, newNode);
        return { ...node, children: newChildren };
      }
      
      // Recursively search in children
      const newChildren = node.children.map(child => 
        this.addSiblingToTree(child, afterNodeId, newNode)
      );
      return { ...node, children: newChildren };
    }
    return node;
  }

  render() {
    return (
      <div className="App">
        <h1>Warnier-Orr Generator</h1>
        <div className="keyboard-help">
          <small>
            Press <kbd>Enter</kbd> to add sibling • <kbd>Ctrl/Cmd+Enter</kbd> to add child
          </small>
        </div>
        <Block 
          isChild={false} 
          id={this.state.rootNode.id}
          children={this.state.rootNode.children} 
          title={this.state.rootNode.title}
          focusedNodeId={this.state.focusedNodeId}
          onFocusNode={this.handleFocusNode}
          onAddSibling={this.handleAddSibling}
        />
      </div>
    );
  }
}

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}



export default App;
