// @flow

import * as Timer from "../"
import ThreadPool from "@task.flow/thread-pool"
import test from "blue-tape"

test("test API", async test => {
  test.isEqual(typeof Timer, "object")
})

test("test timeout", async test => {
  const delay = Timer.timeout(100)
  const start = Date.now()

  const value = await ThreadPool.promise(delay)
  const end = Date.now()

  test.equal(value, undefined)
  test.ok(end - start >= 100, `waited for ${end - start}ms`)
})

test("test timeout.map", async test => {
  const delay = Timer.timeout(200).map(_ => ({ x: 1 }))
  const start = Date.now()

  const value = await ThreadPool.promise(delay)

  const end = Date.now()

  test.isEquivalent(value, { x: 1 })
  test.ok(end - start >= 200, `waited for ${end - start}ms`)
})

test("test cancel timeout", async test => {
  const delay = Timer.timeout(100).map(() => {
    test.fail("timer should have being canceled")
  })

  const start = Date.now()
  const thread = ThreadPool.new()
  thread.run(delay)

  await sleep(10)
  thread.kill()

  await sleep(200)

  const end = Date.now()
  test.pass(`timeout was not triggered in ${end - start}ms`)
})

test("test cancel chained timeouts", async test => {
  let firstComplete = false
  const delay = Timer.timeout(100).chain(() => {
    firstComplete = true

    return Timer.timeout(100)
  })

  const start = Date.now()
  const thread = ThreadPool.new()
  thread.run(delay)

  await sleep(150)
  test.ok(firstComplete, "first timer triggered")
  thread.kill()

  await sleep(300)

  const end = Date.now()
  test.pass(`second timer was not triggered in ${end - start}ms`)
})

const sleep = time => new Promise(resolve => setTimeout(resolve, time))
