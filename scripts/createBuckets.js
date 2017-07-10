const config = require('../config')
const s3 = new config.AWS.S3()

s3.createBucket({
  Bucket: config.photosBucket
}, (err, ok) => {
  if( err ) { throw err }
  console.log(ok)
})
