// tests/unit/dateHelpers.test.js
const {
  getTasksDueToday,
  getTasksDueThisWeek,
  getOverdueTasks,
  formatRelativeTime,
  isWeekend
} = require('../../src/utils/dateHelpers');

describe('Date Helpers', () => {
  
  describe('getTasksDueToday', () => {
    
    // Mock current date
    const mockToday = new Date('2024-06-15T10:00:00'); // Saturday
    
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockToday);
    });
    
    afterAll(() => {
      jest.useRealTimers();
    });
    
    // ✅ Positive Tests
    test('should return tasks due today', () => {
      const todos = [
        { task: 'Task 1', dueDate: '2024-06-15T14:00:00', done: false },
        { task: 'Task 2', dueDate: '2024-06-16T10:00:00', done: false },
        { task: 'Task 3', dueDate: '2024-06-15T23:59:59', done: false }
      ];
      
      const result = getTasksDueToday(todos);
      
      expect(result).toHaveLength(2);
      expect(result[0].task).toBe('Task 1');
      expect(result[1].task).toBe('Task 3');
    });
    
    test('should exclude completed tasks', () => {
      const todos = [
        { task: 'Task 1', dueDate: '2024-06-15T14:00:00', done: true },
        { task: 'Task 2', dueDate: '2024-06-15T16:00:00', done: false }
      ];
      
      const result = getTasksDueToday(todos);
      
      expect(result).toHaveLength(1);
      expect(result[0].task).toBe('Task 2');
    });
    
    // ❌ Negative Tests
    test('should return empty for non-array input', () => {
      expect(getTasksDueToday(null)).toEqual([]);
      expect(getTasksDueToday('string')).toEqual([]);
    });
    
    test('should return empty when no tasks due today', () => {
      const todos = [
        { task: 'Task 1', dueDate: '2024-06-16T10:00:00', done: false },
        { task: 'Task 2', dueDate: '2024-06-14T10:00:00', done: false }
      ];
      
      expect(getTasksDueToday(todos)).toEqual([]);
    });
    
    // 🔍 Boundary Tests
    test('should include task at start of day', () => {
      const todos = [
        { task: 'Task', dueDate: '2024-06-15T00:00:00', done: false }
      ];
      
      expect(getTasksDueToday(todos)).toHaveLength(1);
    });
    
    test('should include task at end of day', () => {
      const todos = [
        { task: 'Task', dueDate: '2024-06-15T23:59:59', done: false }
      ];
      
      expect(getTasksDueToday(todos)).toHaveLength(1);
    });
  });
  
  describe('getTasksDueThisWeek', () => {
    
    const mockToday = new Date('2024-06-15T10:00:00'); // Saturday
    
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockToday);
    });
    
    afterAll(() => {
      jest.useRealTimers();
    });
    
    // ✅ Positive Tests
    test('should return tasks due this week', () => {
      const todos = [
        { task: 'Task 1', dueDate: '2024-06-10T10:00:00', done: false }, // Monday
        { task: 'Task 2', dueDate: '2024-06-15T10:00:00', done: false }, // Saturday
        { task: 'Task 3', dueDate: '2024-06-17T10:00:00', done: false }  // Next week
      ];
      
      const result = getTasksDueThisWeek(todos);
      
      expect(result).toHaveLength(2);
    });
    
    test('should exclude completed tasks', () => {
      const todos = [
        { task: 'Task 1', dueDate: '2024-06-10T10:00:00', done: true },
        { task: 'Task 2', dueDate: '2024-06-11T10:00:00', done: false }
      ];
      
      const result = getTasksDueThisWeek(todos);
      
      expect(result).toHaveLength(1);
      expect(result[0].task).toBe('Task 2');
    });
    
    // ❌ Negative Tests
    test('should return empty for non-array input', () => {
      expect(getTasksDueThisWeek(null)).toEqual([]);
    });
  });
  
  describe('getOverdueTasks', () => {
    
    const mockNow = new Date('2024-06-15T10:00:00');
    
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockNow);
    });
    
    afterAll(() => {
      jest.useRealTimers();
    });
    
    // ✅ Positive Tests
    test('should return overdue tasks', () => {
      const todos = [
        { task: 'Task 1', dueDate: '2024-06-14T10:00:00', done: false },
        { task: 'Task 2', dueDate: '2024-06-16T10:00:00', done: false },
        { task: 'Task 3', dueDate: '2024-06-10T10:00:00', done: false }
      ];
      
      const result = getOverdueTasks(todos);
      
      expect(result).toHaveLength(2);
      expect(result[0].task).toBe('Task 1');
      expect(result[1].task).toBe('Task 3');
    });
    
    test('should exclude completed tasks', () => {
      const todos = [
        { task: 'Task 1', dueDate: '2024-06-14T10:00:00', done: true },
        { task: 'Task 2', dueDate: '2024-06-13T10:00:00', done: false }
      ];
      
      const result = getOverdueTasks(todos);
      
      expect(result).toHaveLength(1);
      expect(result[0].task).toBe('Task 2');
    });
    
    // 🔍 Boundary Tests
    test('should include task due 1 minute ago', () => {
      const todos = [
        { task: 'Task', dueDate: '2024-06-15T09:59:00', done: false }
      ];
      
      expect(getOverdueTasks(todos)).toHaveLength(1);
    });
    
    test('should not include task due in 1 minute', () => {
      const todos = [
        { task: 'Task', dueDate: '2024-06-15T10:01:00', done: false }
      ];
      
      expect(getOverdueTasks(todos)).toHaveLength(0);
    });
  });
  
  describe('formatRelativeTime', () => {
    
    const mockNow = new Date('2024-06-15T10:00:00');
    
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockNow);
    });
    
    afterAll(() => {
      jest.useRealTimers();
    });
    
    // ✅ Positive Tests
    test('should format seconds ago', () => {
      const date = new Date('2024-06-15T09:59:30');
      expect(formatRelativeTime(date)).toBe('30 seconds ago');
    });
    
    test('should format minutes ago', () => {
      const date = new Date('2024-06-15T09:55:00');
      expect(formatRelativeTime(date)).toBe('5 minutes ago');
    });
    
    test('should format hours ago', () => {
      const date = new Date('2024-06-15T08:00:00');
      expect(formatRelativeTime(date)).toBe('2 hours ago');
    });
    
    test('should format days ago', () => {
      const date = new Date('2024-06-13T10:00:00');
      expect(formatRelativeTime(date)).toBe('2 days ago');
    });
    
    test('should format future time', () => {
      const date = new Date('2024-06-15T12:00:00');
      expect(formatRelativeTime(date)).toBe('in 2 hours');
    });
    
    test('should format future days', () => {
      const date = new Date('2024-06-18T10:00:00');
      expect(formatRelativeTime(date)).toBe('in 3 days');
    });
    
    // 🔍 Boundary Tests
    test('should handle singular units', () => {
      const date1 = new Date('2024-06-15T09:59:59');
      expect(formatRelativeTime(date1)).toBe('1 second ago');
      
      const date2 = new Date('2024-06-15T09:59:00');
      expect(formatRelativeTime(date2)).toBe('1 minute ago');
      
      const date3 = new Date('2024-06-15T09:00:00');
      expect(formatRelativeTime(date3)).toBe('1 hour ago');
    });
  });
  
  describe('isWeekend', () => {
    
    // ✅ Positive Tests
    test('should return true for Saturday', () => {
      const saturday = new Date('2024-06-15'); // Saturday
      expect(isWeekend(saturday)).toBe(true);
    });
    
    test('should return true for Sunday', () => {
      const sunday = new Date('2024-06-16'); // Sunday
      expect(isWeekend(sunday)).toBe(true);
    });
    
    test('should return false for weekdays', () => {
      const monday = new Date('2024-06-10');
      const tuesday = new Date('2024-06-11');
      const wednesday = new Date('2024-06-12');
      const thursday = new Date('2024-06-13');
      const friday = new Date('2024-06-14');
      
      expect(isWeekend(monday)).toBe(false);
      expect(isWeekend(tuesday)).toBe(false);
      expect(isWeekend(wednesday)).toBe(false);
      expect(isWeekend(thursday)).toBe(false);
      expect(isWeekend(friday)).toBe(false);
    });
  });
});