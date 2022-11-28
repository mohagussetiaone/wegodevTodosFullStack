import express, { application, Request, Response } from "express"
import mongoose from "mongoose"
import cors from "cors"
import routes from './routes'

// Declare app express & PORT
const app = express()
const PORT = 8080

const {
    MONGODB_ATLAS_USERNAME,
    MONGODB_ATLAS_PASSWORD,
    MONGODB_ATLAS_DBNAME,
} = process.env
const uri = `mongodb+srv://${MONGODB_ATLAS_USERNAME}:${MONGODB_ATLAS_PASSWORD}@cluster0.owayr.mongodb.net/${MONGODB_ATLAS_DBNAME}?retryWrites=true&w=majority`
const option = { useNewUrlParser: true, useUnifiedTopology: true }

app.use(cors())

// consume routes
app.use(routes)

mongoose.set('useFindAndModify', true)
mongoose.connect(uri, option)
    .then(() => {
        // Untuk Mendengarkan / Memanggil
        app.listen(PORT, () => {
            console.info(`App is listening on http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        throw error
    })