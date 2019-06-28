import dedup from './dedup'

describe('api/dedup', () => {
  const response = { message: 'hey there' }
  const createDelay = (ms) => new Promise((resolve) => {
    setTimeout(() => {
      resolve(response)
    }, ms)
  })

  const params1 = { method: 'GET', path: '/v1/stuff', params: { foo: 'bar' }}
  const params2 = { method: 'GET', path: '/v1/stuff/:id', params: { foo: 'bar' }}
  const params3 = { method: 'POST', path: '/v1/stuff/:id', params: { foo: 'bar' }}

  let api
  let run

  beforeEach(() => {
    api = jest.fn(() => createDelay(10))
    run = dedup(api)
  })

  it('caches inflight response, run callbacks properly', () => {
    const callback1 = jest.fn(() => { throw new Error('callback1 error (it\'s ok)') })
    const callback2 = jest.fn(() => {})

    const promise1 = run({ ...params1 })
    const promise2 = run({ ...params1 })

    expect(Object.keys(run.inflight).length).toEqual(1)
    expect(api.mock.calls.length).toEqual(1)
    expect(promise1).toBe(promise2)

    promise1.then(callback1)

    return promise2
      .then(callback2)
      .catch(() => Promise.resolve({}))
      .then(() => {
        expect(Object.keys(run.inflight).length).toEqual(0)

        expect(callback1.mock.calls[0][0]).toEqual(response)
        expect(callback2.mock.calls[0][0]).toEqual(response)

        const promise3 = run({ ...params1 })

        expect(api.mock.calls.length).toEqual(2)
        expect(promise3).not.toBe(promise1)
      })
  })

  it('don\'t mess different requests', () => {
    const promise1 = run({ ...params1 })
    const promise2 = run({ ...params2 })

    expect(Object.keys(run.inflight).length).toEqual(2)

    expect(api.mock.calls.length).toEqual(2)
    expect(promise1).not.toBe(promise2)
  })

  it('don\'t mess with POST requests', () => {
    const promise1 = run(params3)
    const promise2 = run(params3)

    expect(Object.keys(run.inflight).length).toEqual(0)

    expect(api.mock.calls.length).toEqual(2)
    expect(promise1).not.toBe(promise2)
  })
})
