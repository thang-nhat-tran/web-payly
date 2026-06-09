/**
 * Creates a promise whose resolution is controlled externally — useful in
 * tests for asserting intermediate (in-flight) states before settling it.
 */
export function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}
