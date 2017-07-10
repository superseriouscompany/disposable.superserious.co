const multer     = require('multer')
const shortid    = require('shortid')
const models = {
  photo: require('../models/photo')
}

module.exports = function(app) {
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

  app.get('/photos', (req, res, next) => {
    models.photo.all().then((photos) => {
      return res.json({photos: photos})
    }).catch(next)
  })

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

    models.photo.create({
      filename: req.file.filename,
    }).then((photo) => {
      res.json(photo)
    }).catch(next)
  })
}
