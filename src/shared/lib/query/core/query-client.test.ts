import { describe, it, expect, vi } from 'vitest'
import { QueryClient } from './query-client'

describe('QueryClient', () => {
  describe('fetchQuery', () => {
    it('runs queryFn and resolves with its data on a cache miss', async () => {
      const client = new QueryClient()
      const queryFn = vi.fn().mockResolvedValue('hello')

      const result = await client.fetchQuery({ queryKey: ['greeting'], queryFn })

      expect(result).toBe('hello')
      expect(queryFn).toHaveBeenCalledTimes(1)
    })

    it('returns the cached value without calling queryFn again on a hit', async () => {
      const client = new QueryClient()
      const queryFn = vi.fn().mockResolvedValue(42)

      const first = await client.fetchQuery({ queryKey: ['num'], queryFn })
      const second = await client.fetchQuery({ queryKey: ['num'], queryFn })

      expect(first).toBe(42)
      expect(second).toBe(42)
      expect(queryFn).toHaveBeenCalledTimes(1)
    })

    it('treats query keys with the same serialized value as the same cache entry', async () => {
      const client = new QueryClient()
      const queryFn = vi.fn().mockResolvedValue('cached')

      await client.fetchQuery({ queryKey: ['user', 1], queryFn })
      const result = await client.fetchQuery({ queryKey: ['user', 1], queryFn })

      expect(result).toBe('cached')
      expect(queryFn).toHaveBeenCalledTimes(1)
    })

    it('treats different query keys as separate cache entries', async () => {
      const client = new QueryClient()
      const queryFn = vi.fn().mockResolvedValueOnce('a').mockResolvedValueOnce('b')

      const a = await client.fetchQuery({ queryKey: ['k', 1], queryFn })
      const b = await client.fetchQuery({ queryKey: ['k', 2], queryFn })

      expect(a).toBe('a')
      expect(b).toBe('b')
      expect(queryFn).toHaveBeenCalledTimes(2)
    })

    it('rejects with the error thrown by queryFn', async () => {
      const client = new QueryClient()
      const error = new Error('boom')
      const queryFn = vi.fn().mockRejectedValue(error)

      await expect(client.fetchQuery({ queryKey: ['fail'], queryFn })).rejects.toBe(error)
    })

    it('caches errors and re-throws them without re-running queryFn', async () => {
      const client = new QueryClient()
      const error = new Error('boom')
      const queryFn = vi.fn().mockRejectedValue(error)

      await expect(client.fetchQuery({ queryKey: ['fail'], queryFn })).rejects.toBe(error)
      await expect(client.fetchQuery({ queryKey: ['fail'], queryFn })).rejects.toBe(error)

      expect(queryFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('invalidateQuery', () => {
    it('forces queryFn to re-run after invalidation', async () => {
      const client = new QueryClient()
      const queryFn = vi.fn().mockResolvedValueOnce('first').mockResolvedValueOnce('second')

      const first = await client.fetchQuery({ queryKey: ['item'], queryFn })
      client.invalidateQuery(['item'])
      const second = await client.fetchQuery({ queryKey: ['item'], queryFn })

      expect(first).toBe('first')
      expect(second).toBe('second')
      expect(queryFn).toHaveBeenCalledTimes(2)
    })

    it('is a no-op for a key that was never fetched', () => {
      const client = new QueryClient()

      expect(() => client.invalidateQuery(['never'])).not.toThrow()
    })

    it('only invalidates the matching key', async () => {
      const client = new QueryClient()
      const keepFn = vi.fn().mockResolvedValue('keep')
      const dropFn = vi.fn().mockResolvedValueOnce('drop-1').mockResolvedValueOnce('drop-2')

      await client.fetchQuery({ queryKey: ['keep'], queryFn: keepFn })
      await client.fetchQuery({ queryKey: ['drop'], queryFn: dropFn })

      client.invalidateQuery(['drop'])

      await client.fetchQuery({ queryKey: ['keep'], queryFn: keepFn })
      const dropped = await client.fetchQuery({ queryKey: ['drop'], queryFn: dropFn })

      expect(keepFn).toHaveBeenCalledTimes(1)
      expect(dropFn).toHaveBeenCalledTimes(2)
      expect(dropped).toBe('drop-2')
    })
  })

  describe('getQueryState', () => {
    it('returns undefined for a key that was never fetched', () => {
      const client = new QueryClient()

      expect(client.getQueryState(['missing'])).toBeUndefined()
    })

    it('reflects the loading state while the query is in flight', async () => {
      const client = new QueryClient()
      const queryFn = vi.fn().mockResolvedValue('done')

      const pending = client.fetchQuery({ queryKey: ['inflight'], queryFn })
      expect(client.getQueryState(['inflight'])).toEqual({ status: 'pending' })

      await pending
    })

    it('returns the success state with data after a successful fetch', async () => {
      const client = new QueryClient()
      const queryFn = vi.fn().mockResolvedValue('value')

      await client.fetchQuery({ queryKey: ['ok'], queryFn })

      expect(client.getQueryState(['ok'])).toEqual({ status: 'success', data: 'value' })
    })

    it('returns the error state after a failed fetch', async () => {
      const client = new QueryClient()
      const error = new Error('boom')
      const queryFn = vi.fn().mockRejectedValue(error)

      await expect(client.fetchQuery({ queryKey: ['bad'], queryFn })).rejects.toBe(error)

      expect(client.getQueryState(['bad'])).toEqual({ status: 'error', error })
    })

    it('reads state by serialized key value, not reference', async () => {
      const client = new QueryClient()
      const queryFn = vi.fn().mockResolvedValue('value')

      await client.fetchQuery({ queryKey: ['user', 1], queryFn })

      expect(client.getQueryState(['user', 1])).toEqual({ status: 'success', data: 'value' })
    })

    it('returns undefined again after the query is invalidated', async () => {
      const client = new QueryClient()
      const queryFn = vi.fn().mockResolvedValue('value')

      await client.fetchQuery({ queryKey: ['gone'], queryFn })
      expect(client.getQueryState(['gone'])).toBeDefined()

      client.invalidateQuery(['gone'])
      expect(client.getQueryState(['gone'])).toBeUndefined()
    })
  })
})
