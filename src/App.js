import { useState, useRef } from 'react';
import Board from './components/Board';
import { FixedSizeList as List } from 'react-window';
import './styles.css';

const App = () => {
  const [boards, setBoards] = useState([
    {
      id: 1,
      title: "Dummy 1",
      items: [
        { id: 1, content: "Item 1" },
        { id: 2, content: "Item 2" }
      ]
    },
    {
      id: 2,
      title: "Dummy 2",
      items: [
        { id: 3, content: "Item 1" },
        { id: 4, content: "Item 2" }
      ]
    }, {
      id: 3,
      title: "Dummy 3",
      items: [
        { id: 5, content: "Item 1" },
        { id: 6, content: "Item 2" }
      ]
    }
  ]);

  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [dragItem, setDragItem] = useState(null);
  const [dragBoard, setDragBoard] = useState(null);
  const nextBoardId = useRef(boards.length + 1);

  const updateBoards = (updatedBoards) => setBoards(updatedBoards);

  const addItem = (boardId, newItemContent) => {
    const updatedBoards = boards.map(board =>
      board.id === boardId
        ? { ...board, items: [...board.items, { id: Date.now(), content: newItemContent }] }
        : board
    );
    updateBoards(updatedBoards);
  };

  const editBoardTitle = (boardId, newTitle) => {
    updateBoards(boards.map(board =>
      board.id === boardId ? { ...board, title: newTitle } : board
    ));
  };

  const editItemContent = (boardId, itemId, newContent) => {
    updateBoards(boards.map(board =>
      board.id === boardId
        ? {
          ...board,
          items: board.items.map(item =>
            item.id === itemId ? { ...item, content: newContent } : item
          )
        }
        : board
    ));
  };

  const deleteBoard = (boardId) => {
    updateBoards(boards.filter(board => board.id !== boardId));
  };

  const deleteItem = (boardId, itemId) => {
    updateBoards(boards.map(board =>
      board.id === boardId
        ? { ...board, items: board.items.filter(item => item.id !== itemId) }
        : board
    ));
  };

  const handleDragStart = (boardId, itemId) => {
    setDragItem(itemId);
    setDragBoard(boardId);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (targetBoardId) => {
    if (dragItem && dragBoard && dragBoard !== targetBoardId) {
      const sourceBoard = boards.find(board => board.id === dragBoard);
      const item = sourceBoard.items.find(item => item.id === dragItem);

      const updatedBoards = boards.map(board => {
        if (board.id === dragBoard) {
          return {
            ...board,
            items: board.items.filter(i => i.id !== dragItem)
          };
        }
        if (board.id === targetBoardId) {
          return {
            ...board,
            items: [...board.items, item]
          };
        }
        return board;
      });

      updateBoards(updatedBoards);
      setDragItem(null);
      setDragBoard(null);
    }
  };

  const handleAddBoard = () => {
    if (newBoardTitle.trim()) {
      const newBoard = {
        id: nextBoardId.current++,
        title: newBoardTitle.trim(),
        items: []
      };
      setBoards([...boards, newBoard]);
      setNewBoardTitle("");
      setIsAddingBoard(false);
    }
  };

  const handleBoardTitleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddBoard();
    if (e.key === 'Escape') {
      setIsAddingBoard(false);
      setNewBoardTitle("");
    }
  };

  const BoardRow = ({ index, style }) => (
    <div style={style}>
      <Board
        board={boards[index]}
        onAddItem={addItem}
        onEditTitle={editBoardTitle}
        onEditItem={editItemContent}
        onDeleteBoard={deleteBoard}
        onDeleteItem={deleteItem}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
    </div>
  );

  return (
    <div className="main-container">
      <h1 className="title">Personal Task Board</h1>
      <div className="list-container">
        <List
          height={460}
          itemCount={boards.length}
          itemSize={300}
          layout="horizontal"
          width={1000}
        >
          {BoardRow}
        </List>
        <div className="list">
          {isAddingBoard ? (
            <div className="add-board-form">
              <input
                type="text"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                onKeyDown={handleBoardTitleKeyDown}
                onBlur={() => setIsAddingBoard(false)}
                className="input"
                placeholder="Enter Title"
                autoFocus
              />
            </div>
          ) : (
            <button onClick={() => setIsAddingBoard(true)} className="add-item-btn">
              <span>+</span> Add Another List
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;