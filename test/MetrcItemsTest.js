'use strict'

const MetrcItems = require('../lib/MetrcItems')
const Metrc = require('../lib/Metrc')

const sinon = require('sinon')
const assert = require('assert')

describe('MetrcItems', () => {
  const metrc = new Metrc()
  const metrcItems = new MetrcItems(metrc)
  let mockMetrc;

  beforeEach(() => { mockMetrc = sinon.mock(metrc); })
  afterEach(() => { mockMetrc.restore(); })
  
  describe('create', () => {
    const itemName = "Buds - Buddly"
    const payload = { "Name": itemName }
    
    it('posts items create endpoint then gets active items', (done) => {
      mockMetrc.expects('post').
        withArgs('/items/v1/create', payload).
        resolves("OK")
      mockMetrc.expects('get').
        withArgs('/items/v1/active').
        resolves([payload])
     
     metrcItems.create(payload).then((newPackage) => {
       mockMetrc.verify();
       done();
     })
    })
    
    it('gets the Item with the same name and greatest id', (done) => {
      const activeItems = [ 
        { "Id": 4, "Name": itemName }, 
        { "Id": 7, "Name": itemName}, 
        { "Id": 12, "Name": "Something else"}
      ]
      
      mockMetrc.expects('post').resolves("OK")
      mockMetrc.expects('get').resolves(activeItems)
     
     metrcItems.create(payload).then((newItem) => {
       assert.equal(newItem.Id, 7)
       done();
     }).catch((err) => {console.log(err)})
    })
  })
  
  describe('delete', () => {
    it('calls Metrc.delete and passed id to endpoint', (done) => {
      const id = 7;
      mockMetrc.expects('delete').
        withArgs('/items/v1/' + id).
        resolves({})
      
      metrcItems.delete(id).then(() => {
        mockMetrc.verify();
        done();
      })
    })
  })
  
  describe('active', () => {
    it('calls Metrc.get with active items endpoint', (done) => {
      mockMetrc.expects('get').
        withArgs('/items/v1/active').
        resolves([])
      
      metrcItems.active().then(() => {
        mockMetrc.verify()
        done()
      })
    })
    
    it('returns payload as provided by metrc', (done) => {
      const payload = [ {"Name": "Buds - My Buddy"} ]
      mockMetrc.expects('get').resolves(payload)
      
      metrcItems.active().then((results) => {
        assert.equal(results, payload)
        done()
      })
    })
  })
  
  describe('categories', () => {
    it('calls Metrc.get with categories endpoint', (done) => {
      mockMetrc.expects('get')
        .withArgs('/items/v1/categories')
        .resolves([])
      
      metrcItems.categories().then(() => {
        mockMetrc.verify()
        done()
      })
    })
    
    it('returns payload as provided by metrc', (done) => {
      const payload = [ {"Name": "Concentrate"} ]
      mockMetrc.expects('get').resolves(payload)
      
      metrcItems.categories().then((results) => {
        assert.equal(results, payload)
        done()
      })
    })
  })
})