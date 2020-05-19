import { nanoid } from "nanoid"

function compressImage (base64) {
    const canvas = document.createElement('canvas')
    const img = document.createElement('img')
  
    return new Promise((resolve, reject) => {
      img.onload = function () {
        let width = img.width
        let height = img.height
        const maxHeight = 200
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
        Key: nanoid + '.jpg', // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};