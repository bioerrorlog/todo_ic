export const taskDataset = {
  "task-1": { id: "task-1", title: "task-1", description: "Content for task 1" },
  "task-2": { id: "task-2", title: "task-2", description: "Content for task-2" },
  "task-3": { id: "task-3", title: "task-3", description: "Content for task-3" },
  "task-4": { id: "task-4", title: "task-4", description: "Content for task-4" },
}

export const columnDataset = {
  "backlog": { id: "backlog", title: "Backlog", taskIds: ['task-1']},
  "inProgress": { id: "inProgress", title: "In progress", taskIds: ['task-2', 'task-3'] },
  "review": { id: "review", title: "Review", taskIds: [] },
  "done": { id: "done", title: "Done", taskIds: ["task-4"] },
}

export const columnOrder = ["backlog", "inProgress", "review", "done"]
