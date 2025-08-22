import React from 'react';
import logo from './logo.svg';
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
        // Generate ID if not provided
        this.nodeId = props.id || create_UUID();
    }
    
    
    AddChild(){
        let currentChildren = this.props.children;
        let newID = create_UUID();
        let newprops = {
            id:newID,
            title:"new block",
            children:[]
        }
        currentChildren.push(newprops);
        console.log(currentChildren);
        if(!this.props.isChild){
            this.setState({
                children:  currentChildren,
            });
        } else {
            this.props.NotifyParent(this.props.id,this.props.title,currentChildren);
        }
    }
    
    ChildChange(id,title,childArray){
        let children=[];
        if(!this.props.isChild){
            children = this.state.children;
        } else {
            children = this.props.children;
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
            this.props.NotifyParent(this.props.id,this.props.title,children);
        }
    }

    DeleteChild(idToDelete){
        let children=[];
        if(!this.props.isChild){
            children = this.state.children;
        } else {
            children = this.props.children;
        }
        
        const deletedIndex = children.findIndex(child => child.id === idToDelete);
        
        if (deletedIndex !== -1) {
            // Handle selection fallback if the deleted node was selected
            if (this.props.selectedNodeId === idToDelete) {
                let newSelectedId = null;
                
                // Try next sibling
                if (deletedIndex < children.length - 1) {
                    newSelectedId = children[deletedIndex + 1].id;
                }
                // Try previous sibling
                else if (deletedIndex > 0) {
                    newSelectedId = children[deletedIndex - 1].id;
                }
                // Fall back to parent (this node)
                else if (this.nodeId) {
                    newSelectedId = this.nodeId;
                }
                // If no parent, clear selection
                else {
                    this.props.onClearSelection && this.props.onClearSelection();
                    return;
                }
                
                if (this.props.onSelectNode && newSelectedId) {
                    this.props.onSelectNode(newSelectedId);
                }
            }
            
            children = children.filter(child => child.id !== idToDelete);
            
            if(!this.props.isChild){
                this.setState({
                    children:children,
                });
            } else {
                this.props.NotifyParent(this.props.id, this.props.title, children);
            }
        }
    }
    
    handleBlockClick = (e) => {
        e.stopPropagation(); // Prevent event from bubbling to canvas
        if (this.props.onSelectNode) {
            this.props.onSelectNode(this.nodeId);
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
        
        const isSelected = this.props.selectedNodeId === this.nodeId;
        const blockBoxClass = isSelected ? "blockBox selected" : "blockBox";
        
        const kids = children.map((child) => 
            <Block 
                key={child.id} 
                id={child.id} 
                isChild={true} 
                children={child.children} 
                title={child.title} 
                NotifyParent={(id, title, children) => this.ChildChange(id, title, children)}
                selectedNodeId={this.props.selectedNodeId}
                onSelectNode={this.props.onSelectNode}
                onClearSelection={this.props.onClearSelection}
                onDeleteChild={(id) => this.DeleteChild(id)}
            />
        );
        
        return(
            <div 
                className={blockBoxClass}
                onClick={this.handleBlockClick}
                tabIndex={isSelected ? 0 : -1}
                ref={isSelected ? (el) => { if (el) el.focus(); } : null}
            >
                <div className="blockInfo">
                    <div className="blockTitle"><input value={title} readOnly></input></div>
                    {this.props.isChild && (
                        <button 
                            className="deleteBtn" 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                if (this.props.onDeleteChild) {
                                    this.props.onDeleteChild(this.nodeId);
                                }
                            }}
                            title="Delete this block"
                        >
                            ×
                        </button>
                    )}
                </div>
                <div className="brace"> </div>
                
                <div className="children">
                    {kids}
                    <div className="addChild" onClick={(e) => { e.stopPropagation(); this.AddChild(); }}>add child</div>
                </div>
            </div>
        );
    }
    
    
    
}



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNodeId: null
    };
  }

  selectNode = (nodeId) => {
    this.setState({ selectedNodeId: nodeId });
  }

  clearSelection = () => {
    this.setState({ selectedNodeId: null });
  }

  getSelectedNodeId = () => {
    return this.state.selectedNodeId;
  }

  // Expose selection API globally for programmatic access
  componentDidMount() {
    window.warnier_selection = {
      selectNode: this.selectNode,
      clearSelection: this.clearSelection,
      getSelectedNodeId: this.getSelectedNodeId
    };
  }

  handleCanvasClick = (e) => {
    // Clear selection when clicking empty canvas area
    if (e.target.className === 'App') {
      this.clearSelection();
    }
  }

  render() {
    return (
      <div className="App" onClick={this.handleCanvasClick}>
        <h1>Warnier-Orr Generator</h1>
        <Block 
          isChild={false} 
          children={[]} 
          title="Parent"
          id="root"
          selectedNodeId={this.state.selectedNodeId}
          onSelectNode={this.selectNode}
          onClearSelection={this.clearSelection}
          onDeleteChild={() => {}} // Root block can't be deleted
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
