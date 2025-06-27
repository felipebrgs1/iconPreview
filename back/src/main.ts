import express from 'express'
import iconRoutes from './routes/iconRoutes.js'

const app = express()
const port = process.env.PORT || 3001

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS middleware (for frontend integration)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.get('/', (req, res) => {
  res.json({ 
    message: 'Icon Preview API',
    endpoints: {
      upload: 'POST /upload - Upload an image to generate icons',
      getIcon: 'GET /:filename - Get a generated icon file'
    }
  })
})

// Use icon routes
app.use('/', iconRoutes)

app.listen(port, () => {
  console.log(`Icon Preview API listening on port ${port}`)
})
