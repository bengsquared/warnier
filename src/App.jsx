import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function Block({ node, onChange, onDelete, isRoot, onAddSibling, focusedId, setFocusedId }){
    const inputRef = useRef(null);

    useEffect(() => {
        if (focusedId === node.id && inputRef.current) {
            inputRef.current.focus();
        }
    }, [focusedId, node.id]);

    const updateTitle = (e) => {
        onChange({ ...node, title: e.target.value });
    };

    const addChild = () => {
        const newChild = { id: create_UUID(), title: 'new block', children: [] };
        onChange({ ...node, children: [...node.children, newChild] });
        if (setFocusedId) setFocusedId(newChild.id);
    };

    const updateChildAt = (index, updatedChild) => {
        const nextChildren = node.children.map((child, i) => i === index ? updatedChild : child);
        onChange({ ...node, children: nextChildren });
    };

    const deleteSelf = () => {
        if (onDelete) onDelete();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (e.metaKey || e.ctrlKey) {
                e.preventDefault();
                addChild();
            } else if (e.shiftKey) {
                e.preventDefault();
                if (!isRoot && typeof onAddSibling === 'function') {
                    onAddSibling();
                } else {
                    addChild();
                }
            }
        }
    };

    return (
        <div className="blockBox">
            <div className="blockInfo">
                <div className="blockTitle">
                    <input 
                        ref={inputRef}
                        value={node.title}
                        onChange={updateTitle}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                {!isRoot && (
                    <button 
                        className="deleteBtn" 
                        onClick={deleteSelf}
                        title="Delete this block"
                    >
                        ×
                    </button>
                )}
            </div>
            <div className="brace"> </div>
            <div className="children">
                {node.children.map((child, idx) => (
                    <Block 
                        key={child.id}
                        node={child}
                        onChange={(updated) => updateChildAt(idx, updated)}
                        onDelete={() => {
                            const next = node.children.filter((_, i) => i !== idx);
                            onChange({ ...node, children: next });
                        }}
                        isRoot={false}
                        onAddSibling={() => {
                            const newSibling = { id: create_UUID(), title: 'new block', children: [] };
                            const next = [...node.children];
                            next.splice(idx + 1, 0, newSibling);
                            onChange({ ...node, children: next });
                            if (setFocusedId) setFocusedId(newSibling.id);
                        }}
                        focusedId={focusedId}
                        setFocusedId={setFocusedId}
                    />
                ))}
                <div className="addChild" onClick={addChild}>add child</div>
            </div>
        </div>
    );
}

export default function App() {
    const [root, setRoot] = useState({ id: 'root', title: 'root', children: [] });
    const [focusedId, setFocusedId] = useState(null);

    return (
        <div className="App">
            <h1>Warnier-Orr Generator</h1>
            <Block 
                node={root} 
                onChange={setRoot} 
                isRoot={true}
                focusedId={focusedId}
                setFocusedId={setFocusedId}
            />
        </div>
    );
}
