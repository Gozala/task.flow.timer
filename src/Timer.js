// @flow

import type { Thread, Park, Future, Succeed, Poll } from "@task.flow/type"
import type { Lifecycle } from "pool.flow"
import Pool from "pool.flow"
import Task from "@task.flow/task"

class Timeout extends Task<empty, void> {
  time: number
  constructor(time: number) {
    super()
    this.time = time
  }
  spawn(thread: Thread): Future<empty, void> {
    const timer = TimeoutFuture.pool.new(TimeoutFuture)
    timer.result = null
    timer.id = setTimeout(
      TimeoutFuture.timeout,
      this.time,
      thread,
      thread.park(),
      timer
    )
    return timer
  }
}

const result = Task.succeed(undefined)

class TimeoutFuture implements Future<empty, void> {
  static pool: Pool<TimeoutFuture> = new Pool()
  result: ?Succeed<void> = null
  id: TimeoutID
  lifecycle: Lifecycle
  static timeout(thread: Thread, park: Park, timer: TimeoutFuture) {
    timer.result = result
    thread.unpark(park)
  }
  abort() {
    clearTimeout(this.id)
  }
  poll(): Poll<empty, void> {
    const { result } = this
    if (result != null) {
      this.delete()
      return result
    } else {
      return null
    }
  }
  recycle(lifecycle: Lifecycle) {
    this.lifecycle = lifecycle
  }
  delete() {
    this.result = null
    delete this.id
    TimeoutFuture.pool.delete(this)
  }
}

export const timeout = (time: number): Task<empty, void> => new Timeout(time)
