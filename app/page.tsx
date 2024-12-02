'use client';

import { useState, useRef, useCallback } from 'react';

interface Todo {
  id: string;
  text: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Learn Next.js' },
    { id: '2', text: 'Build a todo app' },
    { id: '3', text: 'Add drag and drop' }
  ]);
  const [newTodo, setNewTodo] = useState('');
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos, 
        { id: Date.now().toString(), text: newTodo.trim() }
      ]);
      setNewTodo('');
    }
  };

  const handleDragStart = useCallback((e: React.DragEvent, position: number) => {
    dragItem.current = position;
    setIsDragging(true);
    e.dataTransfer?.setData('text/plain', ''); // Required for Firefox
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent, position: number) => {
    e.preventDefault();
    dragOverItem.current = position;
    
    if (dragItem.current !== null && dragItem.current !== position) {
      const newTodos = [...todos];
      const [reorderedItem] = newTodos.splice(dragItem.current, 1);
      newTodos.splice(position, 0, reorderedItem);
      
      setTodos(newTodos);
      dragItem.current = position;
    }
  }, [todos]);

  const handleDragEnd = useCallback(() => {
    dragItem.current = null;
    dragOverItem.current = null;
    setIsDragging(false);
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      
      <div className="flex mb-4">
        <input 
          type="text" 
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new todo" 
          className="flex-grow p-2 border rounded-l-md"
        />
        <button 
          onClick={addTodo}
          className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <div className="todo-list space-y-2">
        {todos.map((todo, index) => (
          <div 
            key={todo.id}
            id={`todo-${todo.id}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={`
              todo-item 
              p-3 
              bg-gray-100 
              rounded-md 
              cursor-move 
              transition-all 
              duration-300 
              ease-in-out
              ${isDragging && dragItem.current === index ? 'opacity-0' : ''}
              ${isDragging && dragItem.current !== index ? 'opacity-50' : ''}
            `}
          >
            {todo.text}
          </div>
        ))}
      </div>
    </div>
  );
}
