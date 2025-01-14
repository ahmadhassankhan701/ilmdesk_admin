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
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../../../firebase'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { signOut, updatePassword } from 'firebase/auth'
import Cookies from 'js-cookie'
import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
const UpdatePassword = () => {
  const { setState } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState({
    password: '',
    re_password: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (user.password !== user.re_password) {
      toast.error('Password and re-password should match')
      return
    }
    try {
      setLoading(true)
      const currentUser = auth.currentUser

      await updatePassword(currentUser, user.re_password)
      await signOut(auth)
      Cookies.remove('walnut_auth')
      setState({
        user: null,
      })
      setLoading(false)
      toast.success('Password Updated successfully!')
      navigate('/login')
    } catch (error) {
      setLoading(false)
      toast.error('Password could not be updated')
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
            <strong>Update Password</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInputGroup className="mb-4">
                <CInputGroupText>
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="New Password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
              </CInputGroup>
              <CInputGroup className="mb-4">
                <CInputGroupText>
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="Re-enter Password"
                  value={user.re_password}
                  onChange={(e) => setUser({ ...user, re_password: e.target.value })}
                />
              </CInputGroup>
              <CButton
                className="w-100"
                color="primary"
                disabled={!user.password || !user.re_password}
                onClick={handleSubmit}
              >
                Update Password
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UpdatePassword
