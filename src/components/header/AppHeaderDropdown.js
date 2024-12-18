import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilAccountLogout, cilLockLocked, cilSettings, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'
import { useAuth } from '../../context/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const AppHeaderDropdown = () => {
  const { setState } = useAuth()
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      await signOut(auth)
      Cookies.remove('walnut_auth')
      setState({
        user: null,
      })
      navigate('/login')
    } catch (error) {
      toast.error('Logout failed')
      console.log(error)
    }
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownDivider />
        <div
          onClick={handleLogout}
          style={{ cursor: 'pointer', marginLeft: '15px', fontSize: '15px' }}
        >
          <CIcon icon={cilAccountLogout} className="me-2" />
          Log Out
        </div>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
