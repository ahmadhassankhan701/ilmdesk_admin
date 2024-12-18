import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db } from '../../../firebase'
import { doc, setDoc } from 'firebase/firestore'

const Register = () => {
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
      toast.success('Registration Successful. Please login!')
      navigate('/login')
    } catch (error) {
      setLoading(false)
      toast.error('Failed' + error.message)
      console.log(error)
    }
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
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
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
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
                      Create Account
                    </CButton>
                  </div>
                  <div className="d-grid mt-3">
                    <p className="text-body-secondary">
                      Already have an account? <Link to={'/login'}>Login</Link>
                    </p>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
