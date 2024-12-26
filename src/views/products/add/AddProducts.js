import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormTextarea,
  CImage,
  CRow,
  CSpinner,
} from '@coreui/react'
import { addDoc, collection } from 'firebase/firestore'
import { db, storage } from '../../../firebase'
import { toast } from 'react-toastify'
import CIcon from '@coreui/icons-react'
import { cilCamera } from '@coreui/icons'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
const AddProducts = () => {
  const [product, setProduct] = useState({
    id: '',
    title: '',
    desc: '',
    barcode: '',
    image: '',
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async () => {
    if (!product.id || !product.title || !product.desc || !product.barcode) {
      toast.error('All fields are required')
      return
    }
    try {
      setLoading(true)
      const docRef = collection(db, 'Products')
      await addDoc(docRef, {
        ...product,
        currentCheckedUsers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      setLoading(false)
      toast.success('Product added successfully!')
    } catch (error) {
      setLoading(false)
      toast.error('Failed adding product')
      console.log(error)
    }
  }
  const randomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
    let result = ''
    const charactersLength = characters.length
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
  const handleImageUpload = async (e) => {
    try {
      setUploading(true)
      const file = e.target.files[0]
      if (file === undefined || file === null) {
        setUploading(false)
        return
      }
      const formData = new FormData()
      formData.append('document', file)
      const filedata = [...formData]
      const filename = filedata[0][1].name
      const fileExtension = filename.split('.').pop()
      const fileSize = filedata[0][1].size
      if (fileExtension !== 'png' && fileExtension !== 'jpg' && fileExtension !== 'jpeg') {
        setUploading(false)
        toast.error('File type should be png, jpg or jpeg')
        return
      }
      if (fileSize > 2000000) {
        setUploading(false)
        toast.error('File size should not exceed 2MB')
        return
      }
      const path = `ProductImages/${randomId()}`
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      setProduct({ ...product, image: url })
      setUploading(false)
      toast.success('Image uploaded successfully')
    } catch (error) {
      setUploading(false)
      toast.error('Error uploading image')
      console.log(error)
    }
  }
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add New Product</strong>
          </CCardHeader>
          <CCardBody>
            {loading && (
              <div
                style={{
                  position: 'absolute',
                  backgroundColor: '#212333',
                  opacity: 0.7,
                  zIndex: 999,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img src={'/loader.gif'} width={250} height={150} />
              </div>
            )}
            <CForm>
              <div className="mb-3">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <CImage
                    align="center"
                    rounded
                    src={product.image === '' ? '/favicon.ico' : product.image}
                    width={200}
                    height={200}
                  />
                  {uploading ? (
                    <CSpinner color="light" />
                  ) : (
                    <label htmlFor="upload" style={{ marginTop: '10px' }}>
                      <CIcon
                        style={{ color: 'white', cursor: 'pointer' }}
                        size="lg"
                        icon={cilCamera}
                      />
                      <input
                        type="file"
                        id="upload"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <CFormInput
                  type="text"
                  id="exampleFormControlInput1"
                  placeholder="Item Identity"
                  value={product.id}
                  onChange={(e) => setProduct({ ...product, id: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <CFormInput
                  type="text"
                  id="exampleFormControlInput2"
                  placeholder="Title..."
                  value={product.title}
                  onChange={(e) => setProduct({ ...product, title: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <CFormTextarea
                  id="exampleFormControlTextarea1"
                  placeholder="Description..."
                  rows={3}
                  value={product.desc}
                  onChange={(e) => setProduct({ ...product, desc: e.target.value })}
                ></CFormTextarea>
              </div>
              <div className="mb-3">
                <CFormInput
                  type="text"
                  id="exampleFormControlInput2"
                  placeholder="Barcode or serial..."
                  value={product.barcode}
                  onChange={(e) => setProduct({ ...product, barcode: e.target.value })}
                />
              </div>
              <CButton className="w-100" color="primary" onClick={handleSubmit}>
                Submit
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddProducts
