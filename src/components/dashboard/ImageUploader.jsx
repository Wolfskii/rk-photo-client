import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import ImageEditor from '@uppy/image-editor'
import { Dashboard } from '@uppy/react'
import Swedish from '@uppy/locales/lib/sv_SE'
import '@uppy/image-editor/dist/style.css'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import './ImageUploader.scss'

export default function ImageUploader ({ imgurClientID, onUpload, maxPhotos }) {
  const uploadedImgUrls = []

  const uppy = new Uppy({
    locale: Swedish,
    autoProceed: false,
    restrictions: {
      maxFileSize: 20000000,
      maxNumberOfFiles: maxPhotos,
      minNumberOfFiles: 1,
      allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    }
  })

  uppy.use(ImageEditor, {
    id: 'ImageEditor',
    quality: 1,
    cropperOptions: {
      viewMode: 1,
      background: false,
      autoCropArea: 1,
      responsive: true,
      croppedCanvasOptions: {}
    },
    actions: {
      revert: true,
      rotate: true,
      granularRotate: true,
      flip: true,
      zoomIn: true,
      zoomOut: true,
      cropSquare: true,
      cropWidescreen: true,
      cropWidescreenVertical: true
    }
  })

  uppy.use(XHRUpload, {
    endpoint: 'https://api.imgur.com/3/image',
    method: 'post',
    formData: false,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      Authorization: `Client-ID ${imgurClientID}`
    }
  })

  uppy.on('upload-success', (file, response) => {
    /* const httpStatus = response.status // HTTP status code */
    const httpBody = response.body // extracted response data
    const uploadedImgLink = httpBody.data.link

    // Do something with file and response
    uploadedImgUrls.push(uploadedImgLink)
    console.log(uploadedImgLink)
  })

  uppy.on('complete', (result) => {
    // console.log('Upload complete! Uploaded files:', result.successful)
    // console.log(result.successful)
    onUpload(uploadedImgUrls)
  })

  return (
    <Dashboard
      uppy={uppy}
      plugins={['ImageEditor']}
      locale={{
        strings: {
          // Text to show on the droppable area.
          // `%{browse}` is replaced with a link that opens the system file selection dialog.
          dropHereOr: 'Drop here or %{browse}',
          // Used as the label for the link that opens the system file selection dialog.
          browse: 'browse'
        }
      }}
    />
  )
}
