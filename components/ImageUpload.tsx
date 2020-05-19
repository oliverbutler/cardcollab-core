import { nanoid } from "nanoid"

function compressImage (base64) // TODO: this compression code seem v basic might need improved
{
    const canvas = document.createElement('canvas')
    const img = document.createElement('img')
  
    return new Promise((resolve, reject) => {
      img.onload = function () {
        let width = img.width
        let height = img.height // this might have to change depenant on use
        const maxHeight = 200   // for flash card imo I think it is fine but will see
        const maxWidth = 200
  
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height *= maxWidth / width))
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width *= maxHeight / height))
            height = maxHeight
          }
        }
        canvas.width = width
        canvas.height = height
  
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
  
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.onerror = function (err) {
        reject(err)
      }
      img.src = base64
    })
  }

  const uploadFile = (fileName) => {
    // Read content from the file
    var fileContent = fs.readFileSync(fileName);
    fileContent = compressImage(fileContent);

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: nanoid() + '.jpg', // File name you want to save as in S3
        Body: fileContent // nano id 
        ACL: 'public-read'
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};