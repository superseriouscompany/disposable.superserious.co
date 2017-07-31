const multer  = require('multer')
const shortid = require('shortid')
const config  = require('../config')
const fs      = require('fs')
const s3      = new config.AWS.S3()

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

  app.get('/albums/:albumName/photos', (req, res, next) => {
    models.photo.findByGroupId(req.params.albumName).then((photos) => {
      return res.json({photos: photos})
    }).catch(next)
  })

  app.post('/albums/:albumName/photos', upload.single('photo'), (req, res, next) => {
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

    const groupId = req.params.albumName

    s3.upload({
      Bucket:      config.photosBucket,
      Key:         req.file.filename,
      Body:        fs.createReadStream(`./photos/${req.file.filename}`),
      ACL:         'public-read',
      ContentType: req.file.mimetype,
    }, (err, s3Payload) => {
      if( err ) { return next(err) }
      if( !s3Payload || !s3Payload.Location ) { return next(new Error(`s3 returned no url ${JSON.stringify(s3Payload)}`))}

      return models.photo.create({
        filename: req.file.filename,
        url:      s3Payload.Location,
        groupId:  groupId,
      }).then((photo) => {
        res.json(photo)
      }).catch(next)
    })
  })
}
