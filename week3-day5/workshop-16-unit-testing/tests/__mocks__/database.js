// tests/__mocks__/database.js

/**
 * Mock database for testing
 */
const mockDb = {
  // In-memory storage
  _data: {
    todos: []
  },
  
  // Reset data
  _reset() {
    this._data.todos = [
      {
        id: 1,
        task: 'Test todo 1',
        done: false,
        priority: 'high',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        task: 'Test todo 2',
        done: true,
        priority: 'low',
        createdAt: new Date().toISOString()
      }
    ];
  },
  
  // Mock query method
  async query(sql, params = []) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // SELECT all
    if (sql.includes('SELECT * FROM todos') && !sql.includes('WHERE')) {
      return [...this._data.todos];
    }
    
    // SELECT by ID
    if (sql.includes('SELECT * FROM todos WHERE id')) {
      const id = params[0];
      const todo = this._data.todos.find(t => t.id === id);
      return todo ? [todo] : [];
    }
    
    // INSERT
    if (sql.includes('INSERT INTO todos')) {
      const newTodo = params;
      const id = this._data.todos.length + 1;
      const todo = { id, ...newTodo };
      this._data.todos.push(todo);
      return { insertId: id };
    }
    
    // UPDATE
    if (sql.includes('UPDATE todos')) {
      const [data, id] = params;
      const index = this._data.todos.findIndex(t => t.id === id);
      
      if (index === -1) {
        return { affectedRows: 0 };
      }
      
      this._data.todos[index] = { ...this._data.todos[index], ...data };
      return { affectedRows: 1 };
    }
    
    // DELETE
    if (sql.includes('DELETE FROM todos')) {
      const id = params[0];
      const index = this._data.todos.findIndex(t => t.id === id);
      
      if (index === -1) {
        return { affectedRows: 0 };
      }
      
      this._data.todos.splice(index, 1);
      return { affectedRows: 1 };
    }
    
    throw new Error('Query not supported in mock');
  }
};

module.exports = mockDb;