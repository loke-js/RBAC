import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import DbCon from './utlis/db.js'
import AuthRoutes from './routes/Auth.js'
import AdminRoutes from './routes/AdminRoutes.js'

// Configure environment variables
dotenv.config()

// Set up port 
const PORT = process.env.PORT || 3000
const app = express()

// Initialize database connection
DbCon()

// Middleware configuration
app.use(express.json())
app.use(cookieparser())
app.use(cors({
   credentials: true,
   origin: 'http://localhost:5173'  
}));

// Route configurations
app.use('/api/auth', AuthRoutes)
app.use('/api/admin', AdminRoutes)

// Basic health check route
app.get('/', (req, res) => {
   res.send('test')
})

// Start server
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`)
})