import { useState } from "react";
import Item from "./Item";
import "../styles.css";

const Board = ({
    board,
    onAddItem,
    onEditTitle,
    onEditItem,
    onDeleteBoard,
    onDeleteItem,
    onDragStart,
    onDragOver,
    onDrop
}) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleInput, setTitleInput] = useState(board.title);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardContent, setNewCardContent] = useState("");

    const handleAddCard = () => {
        if (newCardContent.trim()) {
            onAddItem(board.id, newCardContent.trim());
        }
        setNewCardContent("");
        setIsAddingCard(false);
    };

    const handleTitleSave = () => {
        onEditTitle(board.id, titleInput);
        setIsEditingTitle(false);
    };

    return (
        <div
            className="list"
            onDragOver={onDragOver}
            onDrop={() => onDrop(board.id)}
        >
            <div className="list-header">
                {isEditingTitle ? (
                    <input
                        type="text"
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        onBlur={handleTitleSave}
                        onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                        className="title-input"
                        autoFocus
                    />
                ) : (
                    <h2
                        className="list-title"
                        onClick={() => setIsEditingTitle(true)}
                    >
                        {board.title}
                    </h2>
                )}
                <button
                    onClick={() => onDeleteBoard(board.id)}
                    className="delete-btn"
                >
                    ×
                </button>
            </div>

            <div className="items-container">
                {board.items.map(item => (
                    <Item
                        key={item.id}
                        item={item}
                        boardId={board.id}
                        onEdit={onEditItem}
                        onDelete={onDeleteItem}
                        onDragStart={onDragStart}
                    />
                ))}
            </div>

            {isAddingCard ? (
                <div className="add-card-container">
                    <input
                        type="text"
                        value={newCardContent}
                        onChange={(e) => setNewCardContent(e.target.value)}
                        onBlur={handleAddCard}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCard()}
                        className="input"
                        placeholder="Enter card"
                        autoFocus
                    />
                </div>
            ) : (
                <button
                    onClick={() => setIsAddingCard(true)}
                    className="add-item-btn"
                >
                    <span>+</span> Add a Card
                </button>
            )}
        </div>
    );
};

export default Board;