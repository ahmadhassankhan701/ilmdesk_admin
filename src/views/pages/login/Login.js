import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilPeople } from '@coreui/icons'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, db } from '../../../firebase'
import { useAuth } from '../../../context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
const Login = () => {
  const navigate = useNavigate()
  const { setState } = useAuth()
  const [user, setUser] = useState({
    role: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const handleSubmit = async () => {
    try {
      setLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password)
      const userRef = doc(db, `Users/${userCredential.user.uid}`)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        if (userSnap.data().role !== user.role) {
          signOut(auth)
          setLoading(false)
          toast.error('Wrong role selected')
          return
        }
      } else {
        signOut(auth)
        setLoading(false)
        toast.error('User not found in db. Contact admin')
        return
      }
      handleState(userCredential.user, user.role)
    } catch (error) {
      setLoading(false)
      toast.error('Failed' + error.message)
      console.log(error)
    }
  }
  const handleState = async (userCred, role) => {
    const user = {
      uid: userCred.uid,
      name: userCred.displayName,
      email: userCred.email,
      image: userCred.photoURL,
      role: role,
    }
    const stateData = { user }
    setState({
      user: stateData.user,
    })
    Cookies.set('walnut_auth', JSON.stringify(stateData), {
      expires: 7,
    })
    setLoading(false)
    navigate('/')
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
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
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
                    <CInputGroup className="mb-3">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          disabled={!user.role || !user.email || !user.password}
                          color="primary"
                          className="px-4"
                          onClick={handleSubmit}
                        >
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Single and unified place to track and trace all the tools and products and
                      their assignees
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
