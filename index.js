const express = require('express')
const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
const app = express()
const port = 5000
// middle ware
app.use(cors())
app.use(express.json())

const uri =
  'mongodb+srv://Shajjad_Gani:UNmOg2k9tFzuC7gk@cluster0.hagtamf.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function run() {
  try {
    await client.connect()
    const database = client.db('JerseyShop')
    const serviceCollection = database.collection('Jersey')
    const AccessoriesCollection = database.collection('Accessories')
    console.log('database connected')
    // send services to the database
    app.post('/services', async (req, res) => {
      const service = req.body
      const result = await serviceCollection.insertOne(service)
      console.log(result)
      res.json(result)
    })

    app.post('/Accessories', async (req, res) => {
      const service = req.body
      const result = await AccessoriesCollection.insertOne(service)
      console.log(result)
      res.json(result)
    })
    // update data into products collection
    app.put('/services/:id([0-9a-fA-F]{24})', async (req, res) => {
      const id = req.params.id.trim()
      console.log('updating', id)
      const updatedService = req.body
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          name: updatedService.name,
          price: updatedService.price,
          size: updatedService.size,
          img: updatedService.img,
        },
      }
      const result = await serviceCollection.updateOne(
        filter,
        updateDoc,
        options,
      )
      console.log('updating', id)
      res.json(result)
    })

    // get all services
    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find({})
      const service = await cursor.toArray()
      res.send(service)
    })
    
    app.get('/Accessories', async (req, res) => {
      const cursor = AccessoriesCollection.find({})
      const service = await cursor.toArray()
      res.send(service)
    })
    // get a single service from service collection
    app.get('/services/:id([0-9a-fA-F]{24})', async (req, res) => {
      const id = req.params.id.trim()
      const query = { _id: ObjectId(id) }
      const service = await serviceCollection.findOne(query)
      res.json(service)
    })

    // delete a data from service collection
    app.delete('/services/:id([0-9a-fA-F]{24})', async (req, res) => {
      const id = req.params.id.trim()
      const query = { _id: new ObjectId(id) }
      const result = await serviceCollection.deleteOne(query)
      res.json('result')
    })
  } finally {
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('JeseyShop_Running')
})

app.listen(port, () => {
  console.log(`JerseyShop  on port ${port}`)
})
