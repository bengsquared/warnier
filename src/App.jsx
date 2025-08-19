import React, { useState, useEffect } from 'react';
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
            <Block key={child.id} id={child.id} isChild={true} children={child.children} title={child.title} NotifyParent={() => this.ChildChange()} />
        );
        
        return(
            <div className="blockBox">
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



function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Get current theme from HTML attribute
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save to localStorage
    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) {
      // Handle localStorage errors gracefully
    }
  };

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      role="switch"
      aria-checked={theme === 'dark'}
    >
      {theme === 'dark' ? '☀️' : '🌙'} 
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}

function App() {
  return (
    <div className="App">
      <div className="app-header">
        <h1>Warnier-Orr Generator</h1>
        <ThemeToggle />
      </div>
      <Block isChild={false} children={[]} title="Parent"   />
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
