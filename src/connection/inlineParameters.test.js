import inlineParameters from './inlineParameters'

describe('api/inlineParameters', () => {
  it('works', () => {
    const api = jest.fn()
    const run = inlineParameters(api)

    run({ method: 'POST', path: '/v1/stuff' })
    expect(api.mock.calls[0][0]).toEqual({ method: 'POST', path: '/v1/stuff', params: {}})

    run({ method: 'POST', path: '/v1/stuff', params: { foo: 'bar' }})
    expect(api.mock.calls[1][0]).toEqual({ method: 'POST', path: '/v1/stuff', params: { foo: 'bar' }})

    run({ method: 'POST', path: '/v1/stuff/:id', params: { id: '5', foo: 'bar' }})
    expect(api.mock.calls[2][0]).toEqual({ method: 'POST', path: '/v1/stuff/5', params: { foo: 'bar' }})

    run({ method: 'POST', path: '/v1/stuff/:id/:item_id', params: { id: '5', foo: 'bar' }})
    expect(api.mock.calls[3][0]).toEqual({ method: 'POST', path: '/v1/stuff/5/:item_id', params: { foo: 'bar' }})
  })
})
