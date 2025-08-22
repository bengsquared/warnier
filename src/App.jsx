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
        
        // Generate ID for root block if not provided
        this.blockId = props.id || create_UUID();
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
    
    handleBlockClick = (e) => {
        e.stopPropagation();
        if (this.props.onSelectNode) {
            this.props.onSelectNode(this.blockId);
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
        const kids = children.map((child) => 
            <Block 
                key={child.id} 
                id={child.id} 
                isChild={true} 
                children={child.children} 
                title={child.title} 
                NotifyParent={() => this.ChildChange()} 
                selectedNodeId={this.props.selectedNodeId}
                onSelectNode={this.props.onSelectNode}
                onClearSelection={this.props.onClearSelection}
            />
        );
        
        const isSelected = this.props.selectedNodeId === this.blockId;
        const blockClassName = `blockBox${isSelected ? ' selected' : ''}`;
        
        return(
            <div className={blockClassName} onClick={this.handleBlockClick}>
                <div className="blockInfo">
                    <div className="blockTitle"><input></input></div>
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



function App() {
  const [selectedNodeId, setSelectedNodeId] = React.useState(null);

  const selectNode = (nodeId) => {
    setSelectedNodeId(nodeId);
  };

  const clearSelection = () => {
    setSelectedNodeId(null);
  };

  const getSelection = () => {
    return selectedNodeId;
  };

  const handleAppClick = (e) => {
    if (e.target.className === 'App') {
      clearSelection();
    }
  };

  return (
    <div className="App" onClick={handleAppClick}>
      <h1>Warnier-Orr Generator</h1>
      <Block 
        isChild={false} 
        children={[]} 
        title="Parent" 
        selectedNodeId={selectedNodeId}
        onSelectNode={selectNode}
        onClearSelection={clearSelection}
      />
    </div>
  );
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
