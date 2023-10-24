(function() {
    'use strict';
    let filename = "";
    let isArchive = false;
    let img = new Image();
    let zip = new JSZip();//or maybe blob
    const canvas = document.getElementById('mycanvas');
    const context = canvas.getContext('2d');
    let fileInput = document.querySelector('#file');
    let width = 0;
    let height = 0;
    
    document.querySelector('#submit').addEventListener('click', formatButton, false);
      
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
        console.log('archive!')
        isArchive=true;
        reader.onload = handleZip;
        reader.readAsArrayBuffer(event.target.files[0]);
      }
      if (filename.slice(-3) == 'png'){
        console.log('image!')
        isArchive=false;
        reader.onload = handleImg;
        reader.readAsDataURL(event.target.files[0]);
      }
        
        img.name = event.target.files[0].name;//TODO
      }
      
      function onReaderLoad(event) {//old ver
        let file = event.target.files;
            if (event.target.files('zip')){//TODO
              handleZip(event) //TODO
            } else {
              handleImg(event)
            }
            
        }
      
      function errorHandler(error) {
        console.error(error);
      };
     
     function formatButton(){//костыли костылики
       if (isArchive){
         let resultList = unzip();
         /*let resultList;
         unzip().then((result)=>resultList=result);*/
         
         console.log(resultList);
         /*resultList.forEach(function(item){
           let result = crop(item);
           draw(result);
         })*/
       }
       else {
         let result = crop(img);
         draw(result);
         pngDownload();
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
    
    
    
    
    
    //document.querySelector('#submit').addEventListener('click', crop, false);
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
      console.log(resultWidth)
      console.log(resultHeight)
      console.log(cropX)
      console.log(cropY)
      img.resultWidth = resultWidth;
      img.resultHeight = resultHeight;
      img.cropX = cropX;
      img.cropY = cropY;
      return img;
      canvas.height = resultHeight;
      canvas.width = resultWidth;
      context.drawImage(img, cropX, cropY, resultWidth, resultHeight, 0, 0, resultWidth, resultHeight)
      pngDownload();
    }
    
    
    document.querySelector('#archive').addEventListener('change', (e)=>isArchive = e, false);
    
    function pngDownload(){
    let image = canvas.toDataURL();
    let aDownloadLink = document.createElement('a');
    aDownloadLink.download = img.name;
    aDownloadLink.href = image;
    aDownloadLink.click();
    }
    
    
    function unzipOLD(){//TODO
        let imageList = [];
        zip.loadAsync(zip.src).then(function(zip) {
          for (let key of Object.keys(zip.files)){
            zip.files[key].async("base64").then(function (content) {
              let dataURI = "data:image/png;base64," + content;
              document.getElementById('test').innerHTML = dataURI
              let imgo = new Image;
              console.log("1");
             imgo.onload = function(){
               imgo.name = key;
               imageList.push("imgo");
               console.log("2");
              };
              imgo.setAttribute("src", dataURI);
              console.log("999");
            })
          }
            console.log("3");
          return imageList;
        });
      
      
    }
      
    function unzip(){//TODO
        let imageList = [];
        zip.loadAsync(zip.src).then(function(zip) {
          //console.log('unzip')
          imageList = process_zip(zip);
          //console.log(imageList)
        }).then(console.log('done!'))
      
      
    }
      
    function process_zip(input){
      const zip_array = input.files;

      for (const [key, value] of Object.entries(zip_array)) {
        console.log(typeof(value.name) )
        //each_entry_zip(value)
        input.file(value.name, each_entry_zip(value))
      }


      input.generateAsync({type:"blob"}).then(function (blob) { // 1) generate the zip file
        saveAs(blob, "hello.zip");                          // 2) trigger the download
    }, function (err) {
        jQuery("#blob").text(err);
    });
      return zip;
    }
    
    async function each_entry_zip(entry){
      console.log('each_entry_zip')
      let content = await entry.async("base64")
      let dataURI = "data:image/png;base64," + content;
      document.getElementById('test').innerHTML = dataURI
      let imgo = new Image();

      imgo = await addImageProcess(dataURI)
      imgo.name = entry.name;
      crop(imgo)
      draw(imgo)
      img.name = imgo.name
      console.log(canvas.toDataURL())
      return dataURItoBlob(canvas.toDataURL())
      pngDownload();
            
    }

    function addImageProcess(src){
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () =>{
          console.log("2")
          resolve(img)
        } 
        img.onerror = reject
        img.src = src
      })
    }

    function dataURItoBlob( dataURI ) {
      // Convert Base64 to raw binary data held in a string.
  
      var byteString = atob(dataURI.split(',')[1]);
  
      // Separate the MIME component.
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
      // Write the bytes of the string to an ArrayBuffer.
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
  
      // Write the ArrayBuffer to a BLOB and you're done.
      var bb = new Blob([ab]);
  
      return bb;
  }

  }
      
      )();