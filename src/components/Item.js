import { useState } from "react";
import "../styles.css";

const Item = ({ item, boardId, onEdit, onDelete, onDragStart }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [contentInput, setContentInput] = useState(item.content);

    const handleSave = () => {
        onEdit(boardId, item.id, contentInput);
        setIsEditing(false);
    };

    return (
        <div
            className="item"
            draggable
            onDragStart={() => onDragStart(boardId, item.id)}
        >
            {isEditing ? (
                <div className="edit-item-container">
                    <input
                        type="text"
                        value={contentInput}
                        onChange={(e) => setContentInput(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        className="content-input"
                        autoFocus
                    />
                    <div className="save-btn-container">
                        <button onClick={handleSave} className="save-btn">
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <div className="item-content-container">
                    <p className="item-content" onClick={() => setIsEditing(true)}>
                        {item.content}
                    </p>
                    <button
                        onClick={() => onDelete(boardId, item.id)}
                        className="delete-item-btn"
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
};

export default Item;
