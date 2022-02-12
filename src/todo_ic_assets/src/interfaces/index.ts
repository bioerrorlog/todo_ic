
export interface TaskOrder {
  id: string
  title: string
  taskIds: string[]
}

export interface TaskOrders {
  backlog: TaskOrder
  inProgress: TaskOrder
  review: TaskOrder
  done: TaskOrder
}
