import { describe, it, expect, vi } from 'vitest'
import { deferred } from '@/shared/utils/promise.util'
import { useMutation } from './useMutation'

describe('useMutation', () => {
  it('starts in the idle state with no data or error', () => {
    const { data, error, status, isPending, isSuccess, isError } = useMutation({
      mutationFn: () => Promise.resolve('x'),
    })

    expect(status.value).toBe('idle')
    expect(data.value).toBeNull()
    expect(error.value).toBeNull()
    expect(isPending.value).toBe(false)
    expect(isSuccess.value).toBe(false)
    expect(isError.value).toBe(false)
  })

  it('passes the payload to mutationFn', async () => {
    const mutationFn = vi.fn().mockResolvedValue('ok')
    const { mutate } = useMutation({ mutationFn })

    await mutate({ id: 1 })

    expect(mutationFn).toHaveBeenCalledWith({ id: 1 })
  })

  it('is pending while in flight, then success with the resolved data', async () => {
    const d = deferred<string>()
    const { mutate, status, isPending, isSuccess, data } = useMutation({
      mutationFn: () => d.promise,
    })

    const pending = mutate(undefined as never)
    expect(status.value).toBe('pending')
    expect(isPending.value).toBe(true)

    d.resolve('done')
    await pending

    expect(status.value).toBe('success')
    expect(isSuccess.value).toBe(true)
    expect(isPending.value).toBe(false)
    expect(data.value).toBe('done')
  })

  it('moves to the error state and stores the error when mutationFn rejects', async () => {
    const error = new Error('boom')
    const {
      mutate,
      status,
      isError,
      error: err,
    } = useMutation({
      mutationFn: () => Promise.reject(error),
    })

    await mutate(undefined as never)

    expect(status.value).toBe('error')
    expect(isError.value).toBe(true)
    expect(err.value).toBe(error)
  })

  it('wraps a non-Error rejection in an Error', async () => {
    const { mutate, error } = useMutation({
      mutationFn: () => Promise.reject('string failure'),
    })

    await mutate(undefined as never)

    expect(error.value).toBeInstanceOf(Error)
    expect(error.value?.message).toBe('string failure')
  })

  it('clears a previous error when the mutation is retried', async () => {
    const mutationFn = vi.fn().mockRejectedValueOnce(new Error('first')).mockResolvedValueOnce('second')
    const { mutate, status, error, data } = useMutation({ mutationFn })

    await mutate(undefined as never)
    expect(status.value).toBe('error')
    expect(error.value).not.toBeNull()

    await mutate(undefined as never)
    expect(status.value).toBe('success')
    expect(error.value).toBeNull()
    expect(data.value).toBe('second')
  })
})
