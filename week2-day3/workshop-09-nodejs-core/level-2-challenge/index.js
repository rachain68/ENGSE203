// index.js
const taskManager = require('./modules/taskManager');
const logger = require('./modules/logger');
const { config, validateConfig } = require('./modules/config');

// Validate configuration
try {
  validateConfig();
} catch (error) {
  logger.error(error.message);
  process.exit(1);
}

// Show banner
function showBanner() {
  console.log('\n' + '='.repeat(60));
  console.log(`  📝 ${config.appName}`);
  console.log('='.repeat(60) + '\n');
}

// Show help
function showHelp() {
  console.log('Usage: node index.js <command> [arguments]\n');
  console.log('Commands:');
  console.log('  add <title> [priority] [--tag <tag>]  - Add a new task (priority: low/medium/high)');
  console.log('  list [filter] [--tag <tag>]          - List tasks (filter: all/pending/completed)');
  console.log('  complete <id>                        - Mark task as completed');
  console.log('  delete <id>                          - Delete a task');
  console.log('  update <id> <title>                  - Update task title');
  console.log('  stats                                - Show statistics');
  console.log('  export <filename>                    - Export tasks to JSON file');
  console.log('  import <filename>                    - Import tasks from JSON file');
  console.log('  search <keyword>                     - Search tasks by keyword');
  console.log('  help                                 - Show this help\n');
  console.log('Examples:');
  console.log('  node index.js add "Buy groceries" high');
  console.log('  node index.js add "Code review" --tag work');
  console.log('  node index.js list pending');
  console.log('  node index.js list --tag work');
  console.log('  node index.js complete 1');
}

// Main function
async function main() {
  showBanner();

  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'add': {
        if (!args[1]) {
          logger.error('Please provide a task title');
          break;
        }
        let priority = 'medium';
        let dueDate = null;
        let tag = null;
        // Parse priority, --due and --tag
        for (let i = 2; i < args.length; i++) {
          if (args[i] === '--due' && args[i+1]) {
            dueDate = args[i+1];
            i++;
          } else if (args[i] === '--tag' && args[i+1]) {
            tag = args[i+1];
            i++;
          } else if (!args[i].startsWith('--')) {
            priority = args[i];
          }
        }
        await taskManager.addTask(args[1], priority, dueDate, tag);
        break;
      }

      case 'list': {
        // node index.js list --overdue
        if (args.includes('--overdue')) {
          await taskManager.listOverdueTasks();
          break;
        }
        // Support: node index.js list [filter] --sort <field> [asc|desc] --tag <tag>
        let filter = 'all';
        let sortField = null;
        let sortOrder = 'asc';
        let tag = null;
        // Parse args for --sort and --tag
        for (let i = 1; i < args.length; i++) {
          if (args[i] === '--sort' && args[i+1]) {
            sortField = args[i+1];
            if (args[i+2] && (args[i+2] === 'asc' || args[i+2] === 'desc')) {
              sortOrder = args[i+2];
            }
          } else if (args[i] === '--tag' && args[i+1]) {
            tag = args[i+1];
            i++;
          } else if (!args[i].startsWith('--') && i === 1) {
            filter = args[i];
          }
        }
        await taskManager.listTasks(filter, sortField, sortOrder, tag);
        break;
      }

      case 'sort':
        const field = args[1] || 'title';
        const order = args[2] || 'asc';
        await taskManager.sortTasks(field, order);
        break;

      case 'complete':
        if (!args[1]) {
          logger.error('Please provide task ID');
          break;
        }
        await taskManager.completeTask(parseInt(args[1]));
        break;

      case 'delete':
        if (!args[1]) {
          logger.error('Please provide task ID');
          break;
        }
        await taskManager.deleteTask(parseInt(args[1]));
        break;

      case 'update':
        if (!args[1] || !args[2]) {
          logger.error('Please provide task ID and new title');
          break;
        }
        await taskManager.updateTask(parseInt(args[1]), args[2]);
        break;

      case 'stats':
        await taskManager.showStats();
        break;

      case 'export':
        if (!args[1]) {
          logger.error('Please provide export filename');
          break;
        }
        await taskManager.exportTasks(args[1]);
        break;

      case 'import':
        if (!args[1]) {
          logger.error('Please provide import filename');
          break;
        }
        await taskManager.importTasks(args[1]);
        break;

      case 'search':
        if (!args[1]) {
          logger.error('Please provide a search keyword');
          break;
        }
        await taskManager.searchTasks(args.slice(1).join(' '));
        break;
      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();