import React from 'react';
import logo from './logo.svg';
import './App.css';

// Helper function to check if the event target is an editable element
const isEditableTarget = (el) => el && el.closest('input, textarea, [contenteditable="true"], [data-editable]') !== null;



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
              isEditing: false
            };
        }
        // Generate ID if not provided
        this.nodeId = props.id || create_UUID();
        this.inputRef = React.createRef();
    }
    
    focusInput = () => {
        requestAnimationFrame(() => {
            if (this.inputRef.current) {
                this.inputRef.current.focus();
            }
        });
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
                children: currentChildren,
            });
            if (this.props.onRootDataChange) {
                this.props.onRootDataChange({
                    id: this.props.id,
                    title: this.state.title,
                    children: currentChildren
                });
            }
        } else {
            this.props.NotifyParent(this.props.id,this.props.title,currentChildren);
        }
        
        // Select the newly created child and focus its input
        if (this.props.onSelectNode) {
            this.props.onSelectNode(newID);
            // Focus will be handled by the newly selected node's componentDidUpdate
        }
    }

    AddSibling(){
        if (!this.props.isChild) return; // Root can't have siblings
        
        let newID = create_UUID();
        let newSibling = {
            id:newID,
            title:"new block",
            children:[]
        }
        
        // Notify parent to add sibling after this node
        if (this.props.NotifyParentAddSibling) {
            this.props.NotifyParentAddSibling(this.nodeId, newSibling);
        }
        
        // Select the newly created sibling and focus its input
        if (this.props.onSelectNode) {
            this.props.onSelectNode(newID);
            // Focus will be handled by the newly selected node's componentDidUpdate
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
            if (this.props.onRootDataChange) {
                this.props.onRootDataChange({
                    id: this.props.id,
                    title: this.props.title,
                    children: children
                });
            } else {
                this.setState({
                    children:children,
                });
            }
        } else {
            this.props.NotifyParent(this.props.id,this.props.title,children);
        }
    }

    AddSiblingAfter(siblingId, newSibling){
        let children=[];
        if(!this.props.isChild){
            children = this.state.children;
        } else {
            children = this.props.children;
        }
        
        // Find the index of the sibling to insert after
        let insertIndex = -1;
        for(let i = 0; i < children.length; i++){
            if (children[i].id === siblingId){
                insertIndex = i + 1;
                break;
            }
        }
        
        if (insertIndex !== -1) {
            // Insert the new sibling at the correct position
            children.splice(insertIndex, 0, newSibling);
            
            if(!this.props.isChild){
                if (this.props.onRootDataChange) {
                    this.props.onRootDataChange({
                        id: this.props.id,
                        title: this.props.title,
                        children: children
                    });
                } else {
                    this.setState({
                        children:children,
                    });
                }
            } else {
                this.props.NotifyParent(this.props.id,this.props.title,children);
            }
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
                if (this.props.onRootDataChange) {
                    this.props.onRootDataChange({
                        id: this.props.id,
                        title: this.props.title,
                        children: children
                    });
                } else {
                    this.setState({
                        children:children,
                    });
                }
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

    handleTitleChange = (e) => {
        const newTitle = e.target.value;
        if(!this.props.isChild){
            this.setState({ title: newTitle });
            // Notify App component of root data change
            if (this.props.onRootDataChange) {
                this.props.onRootDataChange({
                    id: this.props.id,
                    title: newTitle,
                    children: this.state.children
                });
            }
        } else {
            // Notify parent of title change
            this.props.NotifyParent(this.props.id, newTitle, this.props.children);
        }
    }

    startEditing = () => {
        if(!this.props.isChild) {
            this.setState({ isEditing: true });
        }
    }

    stopEditing = () => {
        if(!this.props.isChild) {
            this.setState({ isEditing: false });
        }
    }

    componentDidUpdate(prevProps) {
        // Focus input when this node becomes selected
        if (prevProps.selectedNodeId !== this.props.selectedNodeId && this.props.selectedNodeId === this.nodeId) {
            this.focusInput();
        }
    }

    handleKeyDown = (e) => {
        if (this.props.selectedNodeId !== this.nodeId) return;
        
        // Don't handle keyboard shortcuts when editing text or composing
        if (isEditableTarget(e.target) || e.isComposing) return;
        
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.ctrlKey || e.metaKey) {
                // Cmd+Enter or Ctrl+Enter: Add child
                this.AddChild();
            } else {
                // Enter: Add sibling (or child if this is root)
                if (this.props.isChild) {
                    this.AddSibling();
                } else {
                    // Root node: Enter creates child instead of sibling
                    this.AddChild();
                }
            }
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
                NotifyParentAddSibling={(siblingId, newSibling) => this.AddSiblingAfter(siblingId, newSibling)}
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
                onKeyDown={this.handleKeyDown}
                tabIndex={isSelected ? 0 : -1}
            >
                <div className="blockInfo">
                    <div className="blockTitle">
                        <input 
                            ref={this.inputRef}
                            value={title} 
                            onChange={this.handleTitleChange}
                            onFocus={this.startEditing}
                            onBlur={this.stopEditing}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.target.blur(); // Exit editing mode
                                }
                                e.stopPropagation(); // Prevent block keyboard handlers
                            }}
                        />
                    </div>
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
    
    // Add global keyboard handler for empty editor case
    document.addEventListener('keydown', this.handleGlobalKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleGlobalKeyDown);
  }

  handleGlobalKeyDown = (e) => {
    // Handle undo/redo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      this.undo();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      this.redo();
      return;
    }
    
    // Only handle Enter when no node is selected (empty editor case)
    if (this.state.selectedNodeId === null && e.key === 'Enter') {
      e.preventDefault();
      // Select the root node to enable editing
      this.selectNode('root');
    }
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
          children={this.state.rootData.children} 
          title={this.state.rootData.title}
          id={this.state.rootData.id}
          selectedNodeId={this.state.selectedNodeId}
          onSelectNode={this.selectNode}
          onClearSelection={this.clearSelection}
          onDeleteChild={() => {}} // Root block can't be deleted
          onRootDataChange={this.onRootDataChange}
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
