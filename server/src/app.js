import express from 'express'
const app = express()


app.get('/', (req, res) => {
  res.send('This api is now working')
})

export default app


