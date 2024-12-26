import React, { useEffect, useState } from 'react'
import {
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
import { cilBuilding, cilPencil, cilSearch, cilTrash } from '@coreui/icons'
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
const Departments = () => {
  const { state } = useAuth()
  const [depts, setDepts] = useState([])
  const [lastVisible, setLastVisible] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDepts()
  }, [state && state.user])
  const fetchDepts = async () => {
    try {
      setLoading(true)
      const docRef = collection(db, 'Departments')
      const q = query(docRef, orderBy('createdAt', 'desc'), limit(10))
      const docSnap = await getDocs(q)
      if (docSnap.size == 0) {
        setLoading(false)
        toast.info('No department found')
        return
      }
      // Get the last visible document
      const lastItem = docSnap.docs[docSnap.docs.length - 1]
      setLastVisible(lastItem)
      let deptItems = []
      docSnap.forEach((item) => {
        deptItems.push({ key: item.id, ...item.data() })
      })
      setDepts(deptItems)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error fetching departments')
      console.log(error)
    }
  }
  const handleLoadMore = async () => {
    try {
      setLoading(true)
      const docRef = collection(db, 'Departments')
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
      let deptNewItems = []
      docSnap.forEach((item) => {
        deptNewItems.push({ key: item.id, ...item.data() })
      })
      setDepts((depts) => [...depts, ...deptNewItems])
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error fetching departments')
      console.log(error)
    }
  }
  const handleFilter = async (e) => {
    const val = e.target.value
    if (val == '') {
      fetchDepts()
      return
    }
    try {
      setLoading(true)
      const docRef = collection(db, 'Departments')
      const q = query(docRef, orderBy('createdAt', 'desc'))
      const docSnap = await getDocs(q)
      if (docSnap.size == 0) {
        setLoading(false)
        toast.info('No department found')
        return
      }
      let deptFilterItems = []
      docSnap.forEach((item) => {
        if (item.data().deptId.includes(val)) {
          deptFilterItems.push({ key: item.id, ...item.data() })
        }
      })
      setDepts(deptFilterItems)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error fetching departments')
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
      const docRef = doc(db, `Departments/${id}`)
      await deleteDoc(docRef)
      const newDepts = depts
        .filter((dept) => dept.key !== id)
        .sort((a, b) => a.createdAt - b.createdAt)
      setDepts(newDepts)
      setLoading(false)
      toast.error('Department deleted!')
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
          <CCardHeader
            style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}
          >
            <strong>Departments</strong>
            {state.user && state.user.role === 'admin' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <Link to="/departments/add">
                  <CButton color="primary" shape="pill" size="sm">
                    Add new
                  </CButton>
                </Link>
              </div>
            )}
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
              <p className="text-body-secondary small">Find all departments here</p>
              <CInputGroup size="sm" className="flex-nowrap" style={{ width: '30%' }}>
                <CInputGroupText id="addon-wrapping">
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Search by ID"
                  aria-label="id"
                  aria-describedby="addon-wrapping"
                  onChange={handleFilter}
                />
              </CInputGroup>
            </div>
            <CTable align="middle" responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" className="w-20">
                    ID
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Title
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Created at
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Updated at
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Action
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {depts ? (
                  depts.map((dept) => (
                    <CTableRow key={dept.deptId}>
                      <CTableDataCell>{dept.deptId}</CTableDataCell>
                      <CTableDataCell>{dept.deptTitle}</CTableDataCell>
                      <CTableDataCell>
                        {moment(dept.createdAt.seconds * 1000).format('DD MMM, YYYY ddd')}
                      </CTableDataCell>
                      <CTableDataCell>
                        {moment(dept.updatedAt.seconds * 1000).format('DD MMM, YYYY ddd')}
                      </CTableDataCell>
                      {state.user && state.user.role === 'admin' ? (
                        <CTableDataCell>
                          <Link to={`/departments/edit/${dept.key}`}>
                            <CButton color="primary">Edit</CButton>
                          </Link>
                          <CButton
                            style={{ marginLeft: '10px' }}
                            color="danger"
                            onClick={() => handleDelete(dept.key)}
                          >
                            Delete
                          </CButton>
                        </CTableDataCell>
                      ) : (
                        <CTableDataCell>
                          <CIcon style={{ color: 'white' }} size="lg" icon={cilBuilding} />
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))
                ) : (
                  <h3>No departments found</h3>
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

export default Departments
