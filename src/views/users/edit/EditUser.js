import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilPeople, cilUser } from '@coreui/icons'
const EditUser = () => {
  const { id } = useParams()
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
  })
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetchUser()
  }, [id])
  const fetchUser = async () => {
    try {
      setLoading(true)
      const docRef = doc(db, `Users/${id}`)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const userData = docSnap.data()
        setUser({
          ...user,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        })
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error fetching user')
      console.log(error)
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const docRef = doc(db, `Users/${id}`)
      await updateDoc(docRef, {
        name: user.name,
        email: user.email,
        role: user.role,
        updatedAt: new Date(),
      })
      setLoading(false)
      toast.success('User Updated successfully!')
    } catch (error) {
      setLoading(false)
      toast.error('User could not be updated')
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
            <strong>Edit User</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInputGroup className="mb-4">
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="Name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText>@</CInputGroupText>
                <CFormInput
                  placeholder="Email"
                  autoComplete="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText as="label" htmlFor="inputGroupSelect01">
                  <CIcon icon={cilPeople} />
                </CInputGroupText>
                <CFormSelect
                  id="inputGroupSelect01"
                  onChange={(e) => setUser({ ...user, role: e.target.value })}
                  value={user.role}
                >
                  <option>Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </CFormSelect>
              </CInputGroup>

              <CButton
                className="w-100"
                color="primary"
                disabled={!user.name || !user.email || !user.role}
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

export default EditUser
