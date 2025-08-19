import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

// Theme module
const theme = (() => {
  const THEME_KEY = 'theme';
  const LIGHT = 'light';
  const DARK = 'dark';
  
  const setTheme = (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem(THEME_KEY, themeName);
  };
  
  const current = () => {
    return document.documentElement.getAttribute('data-theme') || LIGHT;
  };
  
  const initialize = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      setTheme(saved);
    } else {
      // Listen to OS preference if no manual override
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const osTheme = mediaQuery.matches ? DARK : LIGHT;
      setTheme(osTheme);
      
      // Listen for changes in OS theme preference
      mediaQuery.addEventListener('change', (e) => {
        // Only apply OS theme if user hasn't manually set a preference
        if (!localStorage.getItem(THEME_KEY)) {
          setTheme(e.matches ? DARK : LIGHT);
        }
      });
    }
  };
  
  const toggle = () => {
    const currentTheme = current();
    const newTheme = currentTheme === LIGHT ? DARK : LIGHT;
    setTheme(newTheme);
    return newTheme;
  };
  
  return { setTheme, current, initialize, toggle, LIGHT, DARK };
})();

// Theme Toggle Component
function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState(theme.current());
  
  useEffect(() => {
    theme.initialize();
    setCurrentTheme(theme.current());
  }, []);
  
  const handleToggle = () => {
    const newTheme = theme.toggle();
    setCurrentTheme(newTheme);
  };
  
  const isLight = currentTheme === theme.LIGHT;
  
  return (
    <button
      id="theme-toggle"
      onClick={handleToggle}
      role="switch"
      aria-checked={!isLight}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      style={{
        padding: '8px 12px',
        border: '1px solid var(--border-color, #ccc)',
        borderRadius: '4px',
        backgroundColor: 'var(--button-bg, #fff)',
        color: 'var(--text-color, #000)',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      {isLight ? '🌙' : '☀️'} {isLight ? 'Dark' : 'Light'}
    </button>
  );
}



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



function App() {
  return (
    <div className="App">
      <h1>Warnier-Orr Generator</h1>
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
