import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../../firebase'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilPeople, cilUser } from '@coreui/icons'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
const CreateUser = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const handleSubmit = async () => {
    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password)
      handleState(userCredential.user)
    } catch (error) {
      setLoading(false)
      toast.error('Failed' + error.message)
      console.log(error)
    }
  }
  const handleState = async (userCred) => {
    try {
      updateProfile(auth.currentUser, {
        displayName: user.name,
      })
      let userData = {
        name: user.name,
        email: user.email,
        image: '',
        role: 'user',
        createdAt: new Date(),
      }
      await setDoc(doc(db, 'Users', userCred.uid), userData)
      setLoading(false)
      toast.success('Created User Successfully!')
      navigate('/users')
    } catch (error) {
      setLoading(false)
      toast.error('Failed' + error.message)
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
            <strong>Create User</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Name"
                  autoComplete="name"
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText>@</CInputGroupText>
                <CFormInput
                  placeholder="Email"
                  autoComplete="email"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>
                <CFormInput
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
              </CInputGroup>
              <div className="d-grid">
                <CButton
                  color="success"
                  onClick={handleSubmit}
                  disabled={!user.name || !user.email || !user.password}
                >
                  Create User
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CreateUser
