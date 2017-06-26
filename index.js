const express    = require('express')
const bodyParser = require('body-parser')
const app        = express()
const port       = process.env.PORT || 3000
const multer     = require('multer')
const shortid    = require('shortid')

app.use(bodyParser.json())

app.use(express.static('photos'))

app.get('/', (req, res) => {
  res.json({version: 1})
})

const upload = multer({
  limits: {fileSize: 1024 * 1024 * 2},
  fileFilter: (req, file, cb) => {
    return cb(null, file.mimetype.match(/^image/))
  },
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
  if( !req.file || !req.file.filename ) {
    const contentType = req.get('Content-Type');
    if( !contentType || !contentType.match(/multipart\/form-data/i) ) {
      return res.status(415).json({
        message: "Your `Content-Type` must be `multipart/form-data`."
      });
    }

    return res.status(400).json({
      message: "You must attach a valid png, jpeg or gif in the `photo` field of your multipart request."
    });
  }
  if( !req.file.size ) {
    return res.status(400).json({
      message: "Uploaded photo file was empty :("
    })
  }

  return res.json({file: req.file && req.file.filename, id: req.file && req.file.filename})
})

if( process.env.NODE_ENV != 'production' && global.TEST_MODE ) {
  module.exports = function(port) {
    const ref    = app.listen(port);
    const handle = ref.close.bind(ref);
    return handle;
  }
  return;
}

app.listen(port, () => {
  console.log(`Listening on ${port}...`)
})
