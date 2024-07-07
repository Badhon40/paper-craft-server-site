const express=require('express')
const cors=require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
 const app=express()
 const port=process.env.PORT || 5000
 
 app.use(express.json())
 app.use(cors())


 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xbwmhk5.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const productCollection=client.db('artAndCraft').collection('addArt');

    // const cardCollection=client.db('artAndCraft').collection('cardSection')
    // await client.connect();
    // await client.db("admin").command({ ping: 1 });
    
    app.post('/addItem',async(req,res)=>{
        console.log(req.body);
        const result=await productCollection.insertOne(req.body)
        res.send(result)
    })
      

    app.get('/allItem',async(req,res)=>{
      const result=await productCollection.find().toArray()
      // console.log(result)
      res.send(result)
    })
  

    // app.get('/addItem',async(req,res)=>{
    //     const cursor=productCollection.find()

    //     const result=await cursor.toArray()
    //     res.send(result)
    // })
     
    app.get("/myItem/:email",async(req,res)=>{
        const query=req.params.email
        console.log(query)
        const result=await productCollection.find({email:query}).toArray();
        res.send(result)

    })

    app.get('/viewOneDetail/:id',async(req,res)=>{
        const query=req.params.id
        console.log(query)
        const result=await productCollection.findOne({_id:new ObjectId(query)})
        res.send(result)
    })

    app.put('/updateItem/:id',async(req,res)=>{
        const query={_id:new ObjectId(req.params.id)}
        const data={
          $set:{
            image:req.body.image,
            item_name: req.body.item_name,
            subcategory_Name: req.body.subcategory_Name,
            short_description: req.body.short_description,
            price: req.body.price,
            rating: req.body.rating,
            customization: req.body.customization,
            processing_time: req.body.processing_time,
            stockStatus: req.body.stockStatus,

          }
         
        }
        const result=await productCollection.updateOne(query,data)
        console.log(result)
        res.send(result)
    })

    app.delete('/delete/:id',async(req,res)=>{
      const result= await productCollection.deleteOne({_id:new ObjectId(req.params.id)})
      res.send(resultnodemon)
    })
    
   
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("aerverConnected")
})

app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})