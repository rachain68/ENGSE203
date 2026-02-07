// src/utils/dateHelpers.js

/**
 * Get tasks due today
 */
function getTasksDueToday(todos) {
  if (!Array.isArray(todos)) {
    return [];
  }
  
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  
  return todos.filter(todo => {
    if (!todo.dueDate || todo.done) {
      return false;
    }
    
    const dueDate = new Date(todo.dueDate);
    return dueDate >= todayStart && dueDate <= todayEnd;
  });
}

/**
 * Get tasks due this week
 */
function getTasksDueThisWeek(todos) {
  if (!Array.isArray(todos)) {
    return [];
  }
  
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Sunday
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // Saturday
  weekEnd.setHours(23, 59, 59, 999);
  
  return todos.filter(todo => {
    if (!todo.dueDate || todo.done) {
      return false;
    }
    
    const dueDate = new Date(todo.dueDate);
    return dueDate >= weekStart && dueDate <= weekEnd;
  });
}

/**
 * Get overdue tasks
 */
function getOverdueTasks(todos) {
  if (!Array.isArray(todos)) {
    return [];
  }
  
  const now = new Date();
  
  return todos.filter(todo => {
    if (!todo.dueDate || todo.done) {
      return false;
    }
    
    const dueDate = new Date(todo.dueDate);
    return dueDate < now;
  });
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
function formatRelativeTime(date) {
  const now = new Date();
  const targetDate = new Date(date);
  const diffMs = targetDate - now;
  const diffSec = Math.floor(Math.abs(diffMs) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  const isPast = diffMs < 0;
  const prefix = isPast ? '' : 'in ';
  const suffix = isPast ? ' ago' : '';
  
  if (diffSec < 60) {
    return `${prefix}${diffSec} second${diffSec !== 1 ? 's' : ''}${suffix}`;
  }
  
  if (diffMin < 60) {
    return `${prefix}${diffMin} minute${diffMin !== 1 ? 's' : ''}${suffix}`;
  }
  
  if (diffHour < 24) {
    return `${prefix}${diffHour} hour${diffHour !== 1 ? 's' : ''}${suffix}`;
  }
  
  return `${prefix}${diffDay} day${diffDay !== 1 ? 's' : ''}${suffix}`;
}

/**
 * Check if date is weekend
 */
function isWeekend(date) {
  const day = new Date(date).getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

module.exports = {
  getTasksDueToday,
  getTasksDueThisWeek,
  getOverdueTasks,
  formatRelativeTime,
  isWeekend
};