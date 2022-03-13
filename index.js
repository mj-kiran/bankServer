// import express
const express = require('express')

const dataService =require('./services/data.services')

const jwt = require('jsonwebtoken')

const cors= require('cors')

// create app using express

const app = express()

//specifying origin using cors

app.use(cors({
    // origin:'http://localhost:4200'
    origin:'http://192.168.52.158:8080'

}))

// parse json
app.use(express.json())


// resolving http request

// get Request - to fetch
app.get('/',(req,res)=>{
    res.status(401).send("GET REQUEST!!!!")
})

// post Request - to Create
app.post('/',(req,res)=>{
    res.send("POST REQUEST!!!!")
})

// put Request - to modify entirely
app.put('/',(req,res)=>{
    res.send("PUT REQUEST!!!!")
})

// patch Request - to modify partially
app.patch('/',(req,res)=>{
    res.send("PATCH REQUEST!!!!")
})

// DELETE Request - to delete
app.delete('/',(req,res)=>{
    res.send("DELETE REQUEST!!!!")
})

// MiddleWare- application specific

// app.use((req,res,next)=>{
//  console.log("APPLICATION SPECIFIC MIDDLEWARE")
//  next()
// })

// MiddleWare- application specific - anotherway

const logMiddleware= (req,res,next)=>{
    console.log("APPLICATION SPECIFIC MIDDLEWARE -2")
    next()
}

app.use(logMiddleware)




// BankApp

// jwtMiddleware - To validate token
const jwtMiddleware = (req,res,next)=>{
    try{
        const token = req.headers["x-access-token"]

    const data = jwt.verify(token,'supersecretkey123')
    req.currentAcc =data.currentAcc
    next()
    }
    catch{
        res.json({
            statusCode:401,
            status:false,
            message:"Please Log In"
        })
    }
    
}

// Register API
app.post('/register',(req,res)=>{

 console.log(req.body.acno)
   dataService.register(req.body.acno,req.body.password,req.body.uname).then(result=>{
  res.status(result.statusCode).json(result)
})
})

// Login API
app.post('/login',(req,res)=>{

    console.log(req.body)
     dataService.login(req.body.acno,req.body.password,).then(result=>{
        res.status(result.statusCode).json(result)
     })
      
    })

// Deposit API
app.post('/deposit',jwtMiddleware,(req,res)=>{

    console.log(req.body)
    // asynchronous
      dataService.deposit(req.body.acno,req.body.password,req.body.amt).then(result=>{
        res.status(result.statusCode).json(result)
      })
     
    })


// Withdraw API

app.post('/withdraw',jwtMiddleware,(req,res)=>{

    console.log(req.body)
    dataService.withdraw(req,req.body.acno,req.body.password,req.body.amt).then(result=>{
        res.status(result.statusCode).json(result)
    })
      
    })

// getTransaction API

app.post('/getTransaction/:acno',jwtMiddleware,(req,res)=>{
 dataService.getTransaction(req.params.acno).then(result=>{
    res.status(result.statusCode).json(result)
 })
})

// deleteAcc API

app.delete('/deleteAcc/:acno',jwtMiddleware,(req,res)=>{
    dataService.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})





//  set port number

app.listen(3000,()=>{
    console.log("Server started at 3000");
})
