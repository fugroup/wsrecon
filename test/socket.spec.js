const Socket = require('../index.js')
let s
let m

beforeEach((done) => {
  if(s) s.disconnect()
  s = new Socket('ws://localhost:6000')
  s.on('open', () => { done() })
  s.on('message', (data) => {
    m = data
  })
})

describe('Socket', () => {
  it('should connect to server', (done) => {
    expect(s.readyState).toEqual(1)
    setTimeout(() => {
      expect(m.message).toBeDefined()
      expect(m.message).toEqual('Welcome')
      done()
    }, 10)
  })

  it('should reconnect automatically', (done) => {
    s.options.reconnect = 1
    s.disconnect(4000)

    setTimeout(() => {
      s.fetch({ baner: 'Risse' }, (data) => {
        expect(data.baner).toEqual('Risse')
        done()
      })
    }, 50)
  })

  it('should send data to the server', (done) => {
    s.send({ baner: 'Lisse' })

    setTimeout(() => {
      expect(m.baner).toEqual('Lisse')
      expect(m['$__cbid__']).toBeUndefined()
      done()
    }, 50)
  })

  it('should support callbacks', (done) => {
    s.fetch({ baner: 'Lisse' }, (data) => {
      expect(data.baner).toEqual('Lisse')
      expect(data['$__cbid__']).toBeUndefined()
    })

    s.fetch({ baner: 'Nisse' }, (data) => {
      expect(data.baner).toEqual('Nisse')
      expect(data['$__cbid__']).toBeUndefined()
      done()
    })
  })

  it('should support promises', (done) => {
    s.fetch({ baner: 'Lisse' }).then((data) => {
      expect(data.baner).toEqual('Lisse')
      expect(data['$__cbid__']).toBeUndefined()
      done()
    })
  })

  it('should support promises async await', async () => {
    const data = await s.fetch({ baner: 'Lisse' })
    expect(data.baner).toEqual('Lisse')
    expect(data['$__cbid__']).toBeUndefined()
  })

  it('should support syntax for events', (done) => {
    s.on('message', (data) => {
      expect(data.message).toEqual('Welcome')
      done()
    })
  })

  it('should support multiple events', (done) => {
    let count = 0
    const s2 = new Socket('ws://localhost:6000')
    s2.on('open', () => { count++ })
    s2.on('open', () => {
      expect(count).toEqual(1);
      done()
    })
  })

  it('should support ping ', (done) => {
    const s2 = new Socket('ws://localhost:6000')
    setTimeout(() => {
      s2.send({ $ping: 1 })
      s2.on('message', (data) => {
        expect(data).toEqual({ $pong: 1 })
        done()
      })
    }, 100)
  })
})
