
export function addImageSRC(src){
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


export function dataURItoBlob( dataURI ) {
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