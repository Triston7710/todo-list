import React, { useState, useEffect } from 'react';
import './TodoList.css';
import { tasksAPI } from '../utils/api';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Load tasks from API
  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll();
      setTasks(response.data);
      // Also save to localStorage as backup
      localStorage.setItem('tasks', JSON.stringify(response.data));
      setError(null);
    } catch (err) {
      setError('Failed to load tasks. Using local storage.');
      // Fallback to localStorage
      const localTasks = localStorage.getItem('tasks');
      if (localTasks) {
        setTasks(JSON.parse(localTasks));
      }
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Create new task
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const response = await tasksAPI.create(newTask);
      setTasks([response.data, ...tasks]);
      // Update localStorage
      const updatedTasks = [response.data, ...tasks];
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setNewTask({ title: '', description: '' });
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create task. Saving locally.');
      // Fallback: save to localStorage
      const localTask = {
        _id: Date.now().toString(),
        ...newTask,
        completed: false,
        createdAt: new Date().toISOString()
      };
      const updatedTasks = [localTask, ...tasks];
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setNewTask({ title: '', description: '' });
      setShowForm(false);
    }
  };

  // Update task
  const handleUpdate = async (id, updates) => {
    try {
      const response = await tasksAPI.update(id, updates);
      const updatedTasks = tasks.map(task => 
        task._id === id ? response.data : task
      );
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setEditingTask(null);
      setError(null);
    } catch (err) {
      setError('Failed to update task. Updating locally.');
      // Fallback: update in localStorage
      const updatedTasks = tasks.map(task => 
        task._id === id ? { ...task, ...updates } : task
      );
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setEditingTask(null);
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await tasksAPI.delete(id);
      const updatedTasks = tasks.filter(task => task._id !== id);
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setError(null);
    } catch (err) {
      setError('Failed to delete task. Deleting locally.');
      // Fallback: delete from localStorage
      const updatedTasks = tasks.filter(task => task._id !== id);
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  };

  // Toggle complete
  const handleToggleComplete = (id) => {
    const task = tasks.find(t => t._id === id);
    handleUpdate(id, { completed: !task.completed });
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="todo-list">
      <div className="todo-header">
        <h2>My Tasks</h2>
        <button 
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Task'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className="task-form">
          <input
            type="text"
            placeholder="Task title *"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            rows="3"
          />
          <button type="submit" className="submit-btn">Create Task</button>
        </form>
      )}

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Create your first task!</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
              isEditing={editingTask === task._id}
              onEdit={() => setEditingTask(task._id)}
              onCancelEdit={() => setEditingTask(null)}
            />
          ))
        )}
      </div>
    </div>
  );
};

const TaskItem = ({ task, onUpdate, onDelete, onToggleComplete, isEditing, onEdit, onCancelEdit }) => {
  const [editForm, setEditForm] = useState({ title: task.title, description: task.description || '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(task._id, editForm);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="task-item editing">
        <input
          type="text"
          value={editForm.title}
          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          required
        />
        <textarea
          value={editForm.description}
          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          rows="2"
        />
        <div className="task-actions">
          <button type="submit" className="save-btn">Save</button>
          <button type="button" onClick={onCancelEdit} className="cancel-btn">Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task._id)}
          className="task-checkbox"
        />
        <div className="task-text">
          <h3>{task.title}</h3>
          {task.description && <p>{task.description}</p>}
          <span className="task-date">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="task-actions">
        <button onClick={onEdit} className="edit-btn">Edit</button>
        <button onClick={() => onDelete(task._id)} className="delete-btn">Delete</button>
      </div>
    </div>
  );
};

export default TodoList;


