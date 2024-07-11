const express=require('express')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors=require('cors')
 const app=express()
 const port=process.env.PORT || 5000
 
 app.use(express.json())
//  app.use(cors({
//   origin:[
//     "http://localhost:5173",
//     "https://art-and-craft-705cb.web.app"

//   ]
//  }))
// const corsOptions = {
//   origin: [
//     'http://localhost:5173',
//     'http://localhost:5174',
//     "https://art-and-craft-705cb.web.app"
    
//   ],
//   credentials: true,
//   optionSuccessStatus: 200,
// }

 app.use(cors())


//  https://server-site-roan-eight.vercel.app

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

    const categoryCollection=client.db('artAndCraft').collection('cardSection')
    // await client.connect();
    // await client.db("admin").command({ ping: 1 });
    
    app.post('/addItem',async(req,res)=>{
        // console.log(req.body);
        const result=await productCollection.insertOne(req.body)
        res.send(result)
    })

   
          app.get('/allItem',async(req,res)=>{
          const result=await productCollection.find().toArray()
          // console.log(result)
          res.send(result)
        })

    app.get("/myItem/:email",async(req,res)=>{
        const query=req.params.email
        // console.log(query)
        const result=await productCollection.find({email:query}).toArray();
        res.send(result)

    })
    

    app.get('/viewOneDetail/:id',async(req,res)=>{
        const query=req.params.id
        // console.log(query)
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
        // console.log(result)
        res.send(result)
    })

    app.delete('/delete/:id',async(req,res)=>{
      const result= await productCollection.deleteOne({_id:new ObjectId(req.params.id)})
      res.send(result)
    })


    app.get("/category",async(req,res)=>{
      const result=await categoryCollection.find().toArray()
      
      res.send(result)
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