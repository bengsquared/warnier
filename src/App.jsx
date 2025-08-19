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
            <Block key={child.id} id={child.id} isChild={true} children={child.children} title={child.title} NotifyParent={(id, title, children) => this.ChildChange(id, title, children)} />
        );
        
        return(
            <div 
                className="blockBox"
                role="group"
                aria-labelledby={`block-title-${this.props.id || 'root'}`}
            >
                <div className="blockInfo">
                    <label htmlFor={`block-input-${this.props.id || 'root'}`} className="blockTitle-label">
                        Block Title:
                    </label>
                    <input 
                        id={`block-input-${this.props.id || 'root'}`}
                        value={title}
                        onChange={(e) => {
                            if (!this.props.isChild) {
                                this.setState({ title: e.target.value });
                            } else {
                                this.props.NotifyParent(this.props.id, e.target.value, this.props.children);
                            }
                        }}
                        aria-describedby={`block-desc-${this.props.id || 'root'}`}
                        className="blockTitle-input"
                    />
                    <div id={`block-desc-${this.props.id || 'root'}`} className="sr-only">
                        Enter a title for this diagram block
                    </div>
                </div>
                <div className="brace" aria-hidden="true"> </div>
                
                <div 
                    className="children"
                    role="group"
                    aria-label={`Child blocks of ${title || 'unnamed block'}`}
                >
                    {kids}
                    <button 
                        className="addChild" 
                        onClick={() => this.AddChild()}
                        aria-label={`Add child block to ${title || 'block'}`}
                        type="button"
                    >
                        Add Child
                    </button>
                </div>
            </div>
        );
    }
    
    
    
}



function App() {
  return (
    <div className="App">
      <header role="banner">
        <h1>Warnier-Orr Diagram Generator</h1>
        <p>Create hierarchical Warnier-Orr diagrams with interactive blocks</p>
      </header>
      <main role="main" aria-label="Diagram editor">
        <Block isChild={false} children={[]} title="Root Block" />
      </main>
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
