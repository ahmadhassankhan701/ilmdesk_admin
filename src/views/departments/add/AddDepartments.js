import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CRow,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
const AddDepartments = () => {
  const [deptId, setDeptId] = useState('')
  const [deptTitle, setDeptTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSubmit = async () => {
    try {
      setLoading(true)
      const docRef = collection(db, `Departments`)
      await addDoc(docRef, { deptId, deptTitle, createdAt: new Date(), updatedAt: new Date() })
      setLoading(false)
      toast.success('Department Added successfully!')
    } catch (error) {
      setLoading(false)
      toast.error('Department could not be added')
      console.log(error)
    }
  }
  return (
    <CRow style={{ position: 'relative' }}>
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
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add New Department</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <div className="mb-3">
                <CFormInput
                  type="text"
                  id="exampleFormControlInput1"
                  placeholder="Department ID"
                  onChange={(e) => setDeptId(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <CFormInput
                  type="text"
                  id="exampleFormControlInput2"
                  placeholder="Title..."
                  onChange={(e) => setDeptTitle(e.target.value)}
                />
              </div>
              <CButton
                className="w-100"
                color="primary"
                disabled={!deptId || !deptTitle}
                onClick={handleSubmit}
              >
                Submit
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddDepartments
