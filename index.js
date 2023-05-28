import express from 'express'

const app = express()
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Twitter Backend Running...')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})