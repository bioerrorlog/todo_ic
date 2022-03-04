import { ActorSubclass } from '@dfinity/agent'
import { ColumnStates, TaskState } from '../interfaces'
import { fetchAllTasks } from './canister'
import { initialColumnDataset, taskDatasetEmpty } from '../constants'
import { todo_ic } from "../../../declarations/todo_ic";
import { _SERVICE } from '../../../declarations/todo_ic/todo_ic.did'


jest.mock('todo_ic');

describe('fetchAllTasks', () => {
  test('dfinity default agent with initial taskState', () => {
    todo_ic.listAllTasks.mockResolvedValue()

    const initialTaskState: TaskState = {
        'tasks': taskDatasetEmpty,
        'columns': initialColumnDataset,
      }

    const expected = {
      0: { id: 0, description: 'This is description 0.' },
      1: { id: 1, description: 'This is description 1.' },
      2: { id: 2, description: 'This is description 2.' },
      3: { id: 3, description: 'This is description 3.' },
    };

    expect(fetchAllTasks(todo_ic, initialTaskState)).toStrictEqual(expected);
  });
});
