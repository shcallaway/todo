const os = require("os");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const moment = require("moment");
const debug = require("debug")("Main");

import TaskManager from "./TaskManager";
import Task from "./Task";
import Commands from "./Commands";
import { parseIntegerArguments } from "./Util";

const FILE = `${os.homedir()}/.todo`;
const VERSION = "1.1";
const HELP = `Usage: todo [command]

Commands:
complete [id]           - Complete task(s)
remove [id]             - Remove task(s)
nuke                    - Remove all tasks
help                    - Print this help message

Examples:
todo                    - List all tasks
todo Check my email     - Add new task "Check my email"
todo remove 488         - Remove task with id 488
todo complete 874 325   - Complete tasks with ids 874 and 325

Author: Sherwood Callaway
Code: http://github.com/shcallaway/todo
Version: ${VERSION}`;

(function main() {
  debug(`File: ${FILE}`);
  debug(`Version: ${VERSION}`);
  debug(`ARGV: ${process.argv}`);

  const tm = new TaskManager(FILE);

  switch (process.argv[2]) {
    case Commands.Remove:
      tm.removeTasks(parseIntegerArguments());
      break;
    case Commands.Complete:
      tm.completeTasks(parseIntegerArguments());
      break;
    case Commands.Nuke:
      fs.existsSync(FILE) && fs.unlinkSync(FILE);
      break;
    case Commands.Help:
      console.log(HELP);
      break;
    default:
      // When no other command is provided, either
      // create a new task or list existing tasks
      const description = process.argv.slice(2).join(" ");
      if (description.length) {
        tm.createTask(description);
      } else {
        tm.printTasks();
      }
  }
})();
