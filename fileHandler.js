import { ifSupportedArchive, ifSupportedImage } from "./util.js";

export function newFile(event){
    return new Promise((resolve, reject) => {
        let isArchive = null
      var files = event.target.files;
      var reader = new FileReader();
      reader.onerror = errorHandler;
      reader.onload = (e)=>{
        
        resolve({src:e.target.result, name:event.target.files[0].name, isArchive:isArchive})
      };

       if (event.target.files[1]){
            event.target.files[0] = event.target.files[1];
            event.target.files[1].remove();
          }
      
    if (ifSupportedArchive(event.target.files[0].name)){
      isArchive=true;
      reader.readAsArrayBuffer(event.target.files[0]);
    }
    if (ifSupportedImage(event.target.files[0].name)){
      isArchive=false;
      reader.readAsDataURL(event.target.files[0]);
    }
      
    })
    
  }

  function errorHandler(error) {
    console.error(error);
  };