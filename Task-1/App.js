import React, { useState, useEffect } from 'react';
import './App.css';
import TodoList from './components/TodoList';
import Auth from './components/Auth';
import Chat from './components/Chat';
import { getToken, removeToken } from './utils/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('todos');

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    setActiveTab('todos');
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>📝 Todo List App</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      
      <nav className="tab-nav">
        <button 
          className={activeTab === 'todos' ? 'active' : ''}
          onClick={() => setActiveTab('todos')}
        >
          Todos
        </button>
        <button 
          className={activeTab === 'chat' ? 'active' : ''}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'todos' && <TodoList />}
        {activeTab === 'chat' && <Chat />}
      </main>
    </div>
  );
}

export default App;


