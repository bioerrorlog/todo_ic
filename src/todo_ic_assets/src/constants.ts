import { ColumnStates, TaskObj } from './interfaces';

export const taskDatasetEmpty: TaskObj = {}

export const initialColumnDataset: ColumnStates = {
  "backlog": { id: "backlog", title: "Backlog", taskIds: []},
  "inProgress": { id: "inProgress", title: "In progress", taskIds: [] },
  "review": { id: "review", title: "Review", taskIds: [] },
  "done": { id: "done", title: "Done", taskIds: [] },
}

export const columnOrder = ["backlog", "inProgress", "review", "done"]
