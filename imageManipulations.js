export function crop(img, width, height){
    let resultWidth, resultHeight, cropX, cropY;
    if(img.width/width > img.height/height){
      resultWidth = width * (img.height/height);
      resultHeight = height * (img.height/height);
      cropX = (img.width-resultWidth)/2
      cropY = 0
    }else{
      resultWidth = width * img.width/width;
      resultHeight = height * img.width/width;
      cropX = 0
      cropY = (img.height-resultHeight)/2
    }
    img.resultWidth = resultWidth;
    img.resultHeight = resultHeight;
    img.cropX = cropX;
    img.cropY = cropY;
    return img;
  }



  