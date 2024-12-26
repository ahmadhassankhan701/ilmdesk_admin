import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CPagination,
  CPaginationItem,
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
import { cilCart, cilPencil, cilSearch, cilTrash, cilUser } from '@coreui/icons'
import { toast } from 'react-toastify'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../../firebase'
import moment from 'moment'
import { useAuth } from '../../context/AuthContext'
const History = () => {
  const { state } = useAuth()
  const [history, setHistory] = useState([])
  const [filteredHistory, setFilteredHistory] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const [visibleItems, setVisibleItems] = useState(10)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAssignedHistory()
  }, [state && state.user])

  const fetchAssignedHistory = async () => {
    try {
      setLoading(true)
      const docRef = collection(db, 'AssignedHistory')
      const q = query(docRef, orderBy('checkedInAt', 'desc'))
      const docSnap = await getDocs(q)
      if (docSnap.size == 0) {
        setLoading(false)
        toast.info('No assignment history found')
        return
      }
      let assignedItems = []
      docSnap.forEach((item) => {
        if (state.user.role === 'user') {
          if (state.user.uid === item.data().userId) {
            assignedItems.push({ key: item.id, ...item.data() })
          }
        } else {
          assignedItems.push({ key: item.id, ...item.data() })
        }
      })
      setHistory(assignedItems)
      setFilteredHistory(assignedItems)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error fetching assignment history')
      console.log(error)
    }
  }
  const handleLoadMore = () => {
    setVisibleItems((prevVisibleItems) => Math.min(prevVisibleItems + 10, filteredHistory.length)) // Load 5 more or all remaining
  }
  const handleFilter = async (e) => {
    const val = e.target.value
    setFilterValue(val)
    if (val == '') {
      fetchAssignedHistory()
      return
    }
    try {
      setLoading(true)
      let filt = [...history]
      let assignedFilterItems = []
      filt.forEach((item) => {
        if (item.productTitle.includes(val)) {
          assignedFilterItems.push(item)
        }
      })
      setFilteredHistory(assignedFilterItems)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error fetching assigned history')
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
            <strong>History</strong>
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
              <p className="text-body-secondary small">See all assignments here</p>
              <CInputGroup size="sm" className="flex-nowrap" style={{ width: '30%' }}>
                <CInputGroupText id="addon-wrapping">
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Search by Product Title"
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
                    Image
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    User
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Prod. Title
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    User Name
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    CheckedIn At
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    CheckedOut At
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredHistory ? (
                  filteredHistory.slice(0, visibleItems).map((hist) => (
                    <CTableRow key={hist.key}>
                      <CTableDataCell>
                        {hist.productImage === '' ? (
                          <CAvatar color="secondary">{hist.productTitle[0]}</CAvatar>
                        ) : (
                          <CImage rounded src={hist.productImage} width={150} height={100} />
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {hist.userImage === '' ? (
                          <CAvatar color="secondary">{hist.userName[0]}</CAvatar>
                        ) : (
                          <CImage rounded src={hist.userImage} width={150} height={100} />
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{hist.productTitle}</CTableDataCell>
                      <CTableDataCell>{hist.userName}</CTableDataCell>
                      <CTableDataCell>
                        {moment(hist.checkedInAt.seconds * 1000).format('DD MMM, YYYY ddd')}
                      </CTableDataCell>
                      <CTableDataCell>
                        {hist.checkedOutAt === ''
                          ? 'Not Yet'
                          : moment(hist.checkedOutAt.seconds * 1000).format('DD MMM, YYYY ddd')}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <h3>No assignments history found</h3>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
          {filterValue == '' && visibleItems < filteredHistory.length && (
            <CButton
              style={{ width: '20%', alignSelf: 'center', marginBottom: '20px' }}
              color="primary"
              onClick={handleLoadMore}
            >
              Load More
            </CButton>
          )}
        </CCard>
      </CCol>
    </CRow>
  )
}

export default History
