import React, { useState } from 'react';
import './Item.css';

const Item = ({ item, boardId, onItemRemove, onItemUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item.text);
  
  // Handle drag start
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      itemId: item.id,
      sourceBoardId: boardId
    }));
    
    // Create a ghost image to hide the default drag image
    const ghost = document.createElement('div');
    ghost.style.position = 'absolute';
    ghost.style.top = '-1000px';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    
    // Add dragging class for styling
    e.target.classList.add('dragging');
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(ghost);
    }, 0);
  };
  
  // Handle drag end
  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
  };
  
  // Handle saving edits
  const handleSaveEdit = () => {
    if (editedText.trim()) {
      onItemUpdate(boardId, item.id, editedText);
    }
    setIsEditing(false);
  };
  
  return (
    <div 
      className="item"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {isEditing ? (
        <div className="item-edit">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            autoFocus
            onBlur={handleSaveEdit}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSaveEdit()}
          />
          <div className="item-edit-actions">
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="item-content">
          <div className="item-text" onClick={() => setIsEditing(true)}>
            {item.text}
          </div>
          <button className="delete-btn" onClick={() => onItemRemove(boardId, item.id)}>×</button>
        </div>
      )}
    </div>
  );
};

export default Item;