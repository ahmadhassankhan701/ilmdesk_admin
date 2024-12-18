import React, { useEffect, useState } from 'react'
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
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
import { useParams } from 'react-router-dom'
const EditDepartment = () => {
  const { id } = useParams()
  const [deptId, setDeptId] = useState('')
  const [deptTitle, setDeptTitle] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetchDepartment()
  }, [id])
  const fetchDepartment = async () => {
    try {
      setLoading(true)
      const docRef = doc(db, `Departments/${id}`)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setDeptId(docSnap.data().deptId)
        setDeptTitle(docSnap.data().deptTitle)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error fetching department')
      console.log(error)
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const docRef = doc(db, `Departments/${id}`)
      await updateDoc(docRef, { deptId, deptTitle, updatedAt: new Date() })
      setLoading(false)
      toast.success('Department Updated successfully!')
    } catch (error) {
      setLoading(false)
      toast.error('Department could not be updated')
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
                  value={deptId}
                  onChange={(e) => setDeptId(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <CFormInput
                  type="text"
                  id="exampleFormControlInput2"
                  placeholder="Title..."
                  value={deptTitle}
                  onChange={(e) => setDeptTitle(e.target.value)}
                />
              </div>
              <CButton
                className="w-100"
                color="primary"
                disabled={!deptId || !deptTitle}
                onClick={handleSubmit}
              >
                Update
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EditDepartment
