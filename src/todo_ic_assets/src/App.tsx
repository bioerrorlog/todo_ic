import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { 
  Box,
  Button,
} from "@chakra-ui/react"
import { ActorSubclass } from '@dfinity/agent'
import { taskDatasetEmpty, initialColumnDataset, columnOrder } from './constants'
import Column from './components/Column'
import Header from './components/Header'
import {
  todo_ic,
  canisterId,
  idlFactory,
} from "../../declarations/todo_ic";
import * as state from './utils/state';
import { TaskState, ColumnState, ColumnStates } from './interfaces'
import { _SERVICE, TaskOrders } from '../../declarations/todo_ic/todo_ic.did'

declare global {
  interface Window { ic: any; }
}

const App = () => {
  const [taskState, setTaskState] = useState<TaskState>({tasks: taskDatasetEmpty, columns: initialColumnDataset})

  const [plugConnected, setPlugConnected] = useState(false);
  const [actor, setActor] = useState<ActorSubclass<_SERVICE> | null>(null);

  const whitelist = [canisterId];
  const network = `http://${canisterId}.localhost:8000`;

  const fetchAllTasks = async () => {
    const allTasks = await todo_ic.listAllTasks()
    const globalTaskOrders = await todo_ic.getGlobalTaskOrders()

    const taskSettedState = state.setTasks(taskState, allTasks)
    const newTaskState = state.setTaskOrders(taskSettedState, globalTaskOrders)
    setTaskState(newTaskState)
  }

  const fetchMyTaskOrders = async () => {
    if (!plugConnected) {
      console.log('Not authorized')
      return
    }

    // Warning: Slow response with plug agent
    const myTaskOrders: TaskOrders = await actor.getMyTaskOrders()
    const newTaskState = state.setTaskOrders(taskState, myTaskOrders)
    setTaskState(newTaskState)
  }

  const createTask = async () => {
    console.log('start creteTask')

    // TODO
    fetchMyTaskOrders()
  }

  const handleConnect = async () => {

    if (!window.ic.plug.agent) {
      await window.ic?.plug?.createAgent({whitelist, network});
    }

    // Create an actor to interact with the basckend Canister
    const actor: ActorSubclass<_SERVICE> = await window.ic.plug.createActor({
      canisterId: canisterId,
      interfaceFactory: idlFactory,
    });

    setActor(actor);
    setPlugConnected(true);
  }


  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {return}
    if (destination.droppableId === source.droppableId && destination.index === source.index) { return }
    if (type === 'column') { return }

    const start: ColumnState = taskState.columns[source.droppableId];
    const finish: ColumnState = taskState.columns[destination.droppableId];

    // If dropped inside the same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);

      // Reorder TaskId
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn: ColumnState = {
        ...start,
        taskIds: newTaskIds,
      }
      const newColumnStates: ColumnStates = {
        ...taskState.columns,
        [newColumn.id]: newColumn,
      }
      const newTaskState: TaskState = {
        ...taskState,
        'columns': newColumnStates,
      }
      setTaskState(newTaskState)
      return
    }

    // If dropped in a different column
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart: ColumnState = {
      ...start,
      taskIds: startTaskIds
    }
    
    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish: ColumnState = {
      ...finish,
      taskIds: finishTaskIds
    }

    const newTaskState: TaskState = {
      ...taskState,
      columns: {
        ...taskState.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      }
    }
    setTaskState(newTaskState)
  }

  useEffect(() => {
    if (!window.ic?.plug?.agent) {
      setActor(null);
      setPlugConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTasks()
  }, []);

  useEffect(() => {
    if (plugConnected) {
      fetchMyTaskOrders()
    }
  }, [plugConnected]);

  return (
    <>
      <Header 
        plugConnected={plugConnected}
        network={network}
        whitelist={whitelist}
        handleConnect={handleConnect}
      />

      <Button variant='outline' ml={30} onClick={createTask}>createTask</Button>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='all-columns' direction='horizontal' type='column'>
          {(provided) => (
            <Box display="flex" {...provided.droppableProps} ref={provided.innerRef}>
              {columnOrder.map((id, index) => {
                const column = taskState.columns[id]
                const tasks = column.taskIds.map(taskId => taskState.tasks[taskId])

                return <Column key={column.id} column={column} tasks={tasks} index={index} />
              })}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </ >
  );
};

export default App;
