import { addImageSRC, dataURItoBlob } from "./util.js";

(function() {
    'use strict';
    let filename = "";
    let isArchive = false;
    let img = new Image();
    let zip = new JSZip();
    const canvas = document.getElementById('mycanvas');
    const context = canvas.getContext('2d');
    let fileInput = document.querySelector('#file');
    let width = 0;
    let height = 0;


    let isLoaded = false
    const formatButton = document.querySelector('#submit')


    
    formatButton.addEventListener('click', formatButtonHandle, false);
    
    
    

    function handleChange(event) {
        var files = event.target.files;
        var reader = new FileReader();
        reader.onerror = errorHandler;
        
         if (event.target.files[1]){
              event.target.files[0] = event.target.files[1];
              event.target.files[1].remove();
            }
        
        filename = event.target.files[0].name
      if (filename.slice(-3) == 'zip'){
        isArchive=true;
        reader.onload = handleZip;
        reader.readAsArrayBuffer(event.target.files[0]);
      }
      if (filename.slice(-3) == 'png' || filename.slice(-3) == 'jpg' ){
        isArchive=false;
        reader.onload = handleImg;
        reader.readAsDataURL(event.target.files[0]);
      }
        
        img.name = event.target.files[0].name;//TODO
      }
      
      
      function errorHandler(error) {
        console.error(error);
      };
     
     function formatButtonHandle(){
      if(isLoaded){
        if (isArchive){
          let resultList = unzip();
          
          console.log(resultList);
        }
        else {
          let result = crop(img);
          draw(result);
          pngDownload();
        }
      }
       
     }
      
      function handleImg(e){
        img.src = e.target.result;
      }
      function handleZip(e){
        zip.src = e.target.result
      }
      
      /*
      drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    Crop operations require all nine parameters:
    
    image, sx, sy — The image object, the x-coordinate, and the y-coordinate from which to start cropping the image.
    sWidth, sHeight — The width of the cropped version, starting from sx and sy.
    dx, dy — The point from which to start drawing the cropped version on the canvas.
    dWidth, dHeight — The width and height of the cropped version to be displayed.
      
      
      */
     
      
    fileInput.addEventListener('change', handleChange, false);
    
    
    document.querySelector('#width').addEventListener('change', (event)=>width=parseInt(event.target.value), false);
    document.querySelector('#height').addEventListener('change', (event)=>height=parseInt(event.target.value), false);
    
    
    
    
    
    function draw(_input){
      canvas.height = _input.resultHeight;
      canvas.width = _input.resultWidth;
      context.drawImage(_input, _input.cropX, _input.cropY, _input.resultWidth, _input.resultHeight, 0, 0, _input.resultWidth, _input.resultHeight)
    }
      
      
    function crop(img){
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
    
    
    document.querySelector('#archive').addEventListener('change', (e)=>isArchive = e, false);
    
    function pngDownload(){
    let image = canvas.toDataURL();
    let aDownloadLink = document.createElement('a');
    aDownloadLink.download = img.name;
    aDownloadLink.href = image;
    aDownloadLink.click();
    }
    
      
    function unzip(){//TODO
        let imageList = [];
        zip.loadAsync(zip.src).then(function(zip) {
          imageList = process_zip(zip);
        }).then(isLoaded = true)
      
      
    }
      
    function process_zip(input){
      const zip_array = input.files;

      for (const [key, value] of Object.entries(zip_array)) {
        input.file(value.name, each_entry_zip(value))
      }


      input.generateAsync({type:"blob"}).then(function (blob) {
        saveAs(blob, filename);                          
    }, function (err) {
        jQuery("#blob").text(err);
    });
      return zip;
    }
    
    async function each_entry_zip(entry){
      let content = await entry.async("base64")
      let dataURI = "data:image/png;base64," + content;
      document.getElementById('test').innerHTML = dataURI
      let imgo = new Image();

      imgo = await addImageSRC(dataURI)
      imgo.name = entry.name;
      crop(imgo)
      draw(imgo)
      img.name = imgo.name
      return dataURItoBlob(canvas.toDataURL())
            
    }

    

    

  }
      
      )();