const express    = require('express')
const bodyParser = require('body-parser')
const app        = express()
const port       = process.env.PORT || 3000
const multer     = require('multer')
const shortid    = require('shortid')

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({version: 1})
})

const upload = multer({
  limits: {fileSize: 1024 * 1024 * 2},
  storage: multer.diskStorage({
    destination: 'photos/',
    filename: function(req, file, cb) {
      const id = shortid.generate();
      const extension = file.originalname.split('.')[1];
      if( !extension )  { return cb(null, id); }
      cb(null, `${id}.${extension}`);
    },
  }),
});

app.post('/photos', upload.single('photo'), (req, res, next) => {
  console.log(req.file && req.file.filename)

  return res.json({cool: 'nice'})

  if( !req.file || !req.file.filename ) {
    const contentType = req.get('Content-Type');
    if( !contentType || !contentType.match(/multipart\/form-data/i) ) {
      return res.status(415).json({
        message: "Your `Content-Type` must be `multipart/form-data`."
      });
    }

    return res.status(400).json({
      message: "You must attach a valid photo in the `photo` field of your multipart request."
    });
  }
})

app.listen(port, () => {
  console.log(`Listening on ${port}...`)
})
