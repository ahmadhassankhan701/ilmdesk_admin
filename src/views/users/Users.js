import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilSearch, cilTrash, cilUser } from '@coreui/icons'
import { toast } from 'react-toastify'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore'
import { db } from '../../firebase'
import moment from 'moment'
import { useAuth } from '../../context/AuthContext'
const Users = () => {
  const { state } = useAuth()
  const [users, setUsers] = useState([])
  const [lastVisible, setLastVisible] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const docRef = collection(db, 'Users')
      const q = query(docRef, orderBy('createdAt', 'desc'), limit(10))
      const docSnap = await getDocs(q)
      if (docSnap.size == 0) {
        setLoading(false)
        toast.info('No user found')
        return
      }
      // Get the last visible document
      const lastItem = docSnap.docs[docSnap.docs.length - 1]
      setLastVisible(lastItem)
      let userItems = []
      docSnap.forEach((item) => {
        userItems.push({ key: item.id, ...item.data() })
      })
      setUsers(userItems)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error fetching users')
      console.log(error)
    }
  }
  const handleLoadMore = async () => {
    try {
      setLoading(true)
      const docRef = collection(db, 'Users')
      const q = query(docRef, orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(10))
      const docSnap = await getDocs(q)
      if (docSnap.size == 0) {
        setLoading(false)
        toast.info('End of the data')
        return
      }
      // Get the last visible document
      const lastItem = docSnap.docs[docSnap.docs.length - 1]
      setLastVisible(lastItem)
      let userNewItems = []
      docSnap.forEach((item) => {
        userNewItems.push({ key: item.id, ...item.data() })
      })
      setUsers((users) => [...users, ...userNewItems])
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error fetching users')
      console.log(error)
    }
  }
  const handleFilter = async (e) => {
    const val = e.target.value
    if (val == '') {
      fetchUsers()
      return
    }
    try {
      setLoading(true)
      const docRef = collection(db, 'Users')
      const q = query(docRef, orderBy('createdAt', 'desc'))
      const docSnap = await getDocs(q)
      if (docSnap.size == 0) {
        setLoading(false)
        toast.info('No user found')
        return
      }
      let userFilterItems = []
      docSnap.forEach((item) => {
        if (item.data().name.includes(val)) {
          userFilterItems.push({ key: item.id, ...item.data() })
        }
      })
      setUsers(userFilterItems)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error fetching users')
      console.log(error)
    }
  }
  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure to delete?')
    if (!confirm) {
      return
    }
    try {
      setLoading(true)
      const docRef = doc(db, `Users/${id}`)
      await deleteDoc(docRef)
      const newUsers = users
        .filter((user) => user.key !== id)
        .sort((a, b) => a.createdAt - b.createdAt)
      setUsers(newUsers)
      setLoading(false)
      toast.error('User deleted!')
    } catch (error) {
      setLoading(false)
      toast.error('Deletion failed')
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <strong>Users</strong>
              {state && state.user && state.user.role == 'admin' && (
                <Link to={`/users/new`}>
                  <CButton color="primary">Create User</CButton>
                </Link>
              )}
            </div>
          </CCardHeader>
          <CCardBody>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                flexWrap: 'nowrap',
              }}
            >
              <p className="text-body-secondary small">Find all users here</p>
              <CInputGroup size="sm" className="flex-nowrap" style={{ width: '30%' }}>
                <CInputGroupText id="addon-wrapping">
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Search by name"
                  aria-label="name"
                  aria-describedby="addon-wrapping"
                  onChange={handleFilter}
                />
              </CInputGroup>
            </div>
            <CTable align="middle" responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" className="w-20">
                    Image
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Name
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Email
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Role
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Joined at
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Action
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {users ? (
                  users.map((user, i) => (
                    <CTableRow key={user.key}>
                      <CTableDataCell>
                        {user.image === '' ? (
                          <CAvatar color="secondary">{user.name[0]}</CAvatar>
                        ) : (
                          <CAvatar src={user.image} />
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{user.name}</CTableDataCell>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>{user.role}</CTableDataCell>
                      <CTableDataCell>
                        {moment(user.createdAt.seconds * 1000).format('DD MMM, YYYY')}
                      </CTableDataCell>
                      {state && state.user && state.user.role === 'admin' ? (
                        <CTableDataCell>
                          <Link to={`/users/edit/${user.key}`}>
                            <CButton color="primary">Edit</CButton>
                          </Link>
                          <CButton
                            style={{ marginLeft: '10px' }}
                            color="danger"
                            onClick={() => handleDelete(user.key)}
                          >
                            Delete
                          </CButton>
                        </CTableDataCell>
                      ) : (
                        <CTableDataCell>
                          <CIcon style={{ color: 'white' }} size="lg" icon={cilUser} />
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))
                ) : (
                  <h3>No users found</h3>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
          <CButton
            style={{ width: '20%', alignSelf: 'center', marginBottom: '20px' }}
            color="primary"
            onClick={handleLoadMore}
          >
            Load More
          </CButton>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Users
