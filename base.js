import { newFile } from "./fileHandler.js";
import { crop } from "./imageManipulations.js";
import { addImageSRC, dataURItoBlob, ifSupportedArchive, ifSupportedImage } from "./util.js";

(function() {
    'use strict';
    let isArchive = false;
    let filename = ""
    let img = new Image();
    let zip = new JSZip();
    const canvas = document.getElementById('mycanvas');
    const context = canvas.getContext('2d');
    let fileInput = document.querySelector('#file');
    let width = 0;
    let height = 0;


    let isLoaded = true
    const formatButton = document.querySelector('#submit')


    
    formatButton.addEventListener('click', formatButtonHandle, false);
    
    
    





    async function handleChange(event){
      let file = await newFile(event)
      filename = file.name
      isArchive = file.isArchive
      if (file.name.slice(-3) == 'zip'){
        zip.src = file.src
      }
      if (ifSupportedImage(file.name)){
        img.src = file.src
      }

    }

      
      
      
     
     function formatButtonHandle(){
      if(isLoaded){
        if (isArchive){
          let resultList = unzip();
        }
        else {
          let result = crop(img, width, height);
          draw(result);
          imgDownload();
        }
      }
       
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
    
    
    
    
    
    
      
      
    
    
    
    
    
    function imgDownload(){
    let image = canvas.toDataURL();
    let aDownloadLink = document.createElement('a');
    aDownloadLink.download = img.name;
    aDownloadLink.href = image;
    aDownloadLink.click();
    }

    function draw(_input){
      canvas.height = _input.resultHeight;
      canvas.width = _input.resultWidth;
      context.drawImage(_input, _input.cropX, _input.cropY, _input.resultWidth, _input.resultHeight, 0, 0, _input.resultWidth, _input.resultHeight)
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
        console.log(err)
    });
      return zip;
    }
    
    async function each_entry_zip(entry){
      let content = await entry.async("base64")
      let dataURI = "data:image/png;base64," + content;
      let imgo = new Image();

      imgo = await addImageSRC(dataURI)
      imgo.name = entry.name;
      crop(imgo, width, height)
      draw(imgo)
      img.name = imgo.name
      return dataURItoBlob(canvas.toDataURL())
            
    }

    

    

  }
      
      )();