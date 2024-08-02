import express from 'express'
import multer from 'multer'
import cors from 'cors'
import path from 'path'
import crypto from 'crypto'
import helmet from 'helmet'

const app = express()
app.use(cors())
app.use(helmet())

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        crypto.randomBytes(32, (err, buf) => {
            if ( err ) return cb(err, '')
            cb(null, buf.toString('hex') + path.extname(file.originalname))
        })
    }
})

const upload = multer({ storage: storage })

app.post('/upload', upload.single('file'), (req, res) => {
    if ( !req.file ) {
        return res.status(400).send('No file uploaded.')
    }
    const fileUrl = `http://localhost:3001/files/${ req.file.filename }`
    res.json({ fileUrl })
})

app.use('/files', express.static('uploads'))

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${ PORT }`)
})