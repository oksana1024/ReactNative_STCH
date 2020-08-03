import {storage} from '../constants/firebase';
import RNFetchBlob from 'rn-fetch-blob';

export const uploadImage = (uri, mime = 'application/octet-stream') => {
  const Blob = RNFetchBlob.polyfill.Blob
  const fs = RNFetchBlob.fs;
  const tempWindowXMLHttpRequest = window.XMLHttpRequest;
  window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
  window.Blob = Blob
  console.log("Upload Image Uri $$$$$$$$$$$$$$$$$$", uri);
  return new Promise((resolve, reject) => {
    //const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri//'https://avatars0.githubusercontent.com/u/12028011?v=3&s=200'
    const uploadUri = uri.replace('file://', '');
    const sessionId = new Date().getTime()
    let uploadBlob = null
    const imageRef = storage.ref('images').child(`${sessionId}`)
    fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` })
      })
      .then((blob) => {
        uploadBlob = blob
        return imageRef.put(uri, { contentType: mime })
      })
      .then(() => {
        uploadBlob.close()
        window.XMLHttpRequest = tempWindowXMLHttpRequest;
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        resolve(url)
      })
      .catch((error) => {
        window.XMLHttpRequest = tempWindowXMLHttpRequest;
        reject(error)
      })
  })
}

export const downloadFile = (uri, location) => {
  return new Promise((resolve, reject) => {
    
  })
}