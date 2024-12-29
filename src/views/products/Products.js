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
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
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
} from 'firebase/firestore'
import { db } from '../../firebase'
import moment from 'moment'
import { useAuth } from '../../context/AuthContext'
const Products = () => {
  const { state } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [userDetails, setUserDetails] = useState([])
  const [lastVisible, setLastVisible] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [state && state.user])
  useEffect(() => {
    if (state.user.role === 'user') {
      fetchCurrentAssignedItems()
    }
  }, [state && state.user])
  const fetchCurrentAssignedItems = async () => {
    try {
      setLoading(true)
      const docRef = doc(db, `Users/${state.user.uid}`)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists) {
        setUserDetails({ key: docSnap.id, ...docSnap.data() })
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Failed to fetch user details')
      console.log(error)
    }
  }
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const docRef = collection(db, 'Products')
      const q = query(docRef, orderBy('createdAt', 'desc'), limit(10))
      const docSnap = await getDocs(q)
      if (docSnap.size == 0) {
        setLoading(false)
        toast.info('No product found')
        return
      }
      // Get the last visible document
      const lastItem = docSnap.docs[docSnap.docs.length - 1]
      setLastVisible(lastItem)
      let productItems = []
      docSnap.forEach((item) => {
        productItems.push({ key: item.id, ...item.data() })
      })
      setProducts(productItems)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error fetching products')
      console.log(error)
    }
  }
  const handleLoadMore = async () => {
    try {
      setLoading(true)
      const docRef = collection(db, 'Products')
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
      let productNewItems = []
      docSnap.forEach((item) => {
        productNewItems.push({ key: item.id, ...item.data() })
      })
      setProducts((products) => [...products, ...productNewItems])
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error fetching products')
      console.log(error)
    }
  }
  const handleFilter = async (e) => {
    const val = e.target.value
    if (val == '') {
      fetchProducts()
      return
    }
    try {
      setLoading(true)
      const docRef = collection(db, 'Products')
      const q = query(docRef, orderBy('createdAt', 'desc'))
      const docSnap = await getDocs(q)
      if (docSnap.size == 0) {
        setLoading(false)
        toast.error('No product found')
        return
      }
      let productFilterItems = []
      docSnap.forEach((item) => {
        if (item.data().id.includes(val)) {
          productFilterItems.push({ key: item.id, ...item.data() })
        }
      })
      setProducts(productFilterItems)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error fetching products')
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
      const docRef = doc(db, `Products/${id}`)
      await deleteDoc(docRef)
      const newProducts = products
        .filter((product) => product.key !== id)
        .sort((a, b) => a.createdAt - b.createdAt)
      setProducts(newProducts)
      setLoading(false)
      toast.error('Product deleted!')
    } catch (error) {
      setLoading(false)
      toast.error('Deletion failed')
      console.log(error)
    }
  }
  const handleCheckOut = async (product) => {
    try {
      setLoading(true)
      const docRef = collection(db, 'AssignedHistory')
      const newDoc = await addDoc(docRef, {
        productId: product.key,
        productTitle: product.title,
        productImage: product.image,
        userId: userDetails.key,
        userName: userDetails.name,
        userImage: userDetails.image,
        checkedInAt: '',
        checkedOutAt: new Date(),
      })
      let currentlyAssigned = []
      if (userDetails.currentAssigned && userDetails.currentAssigned.length > 0) {
        currentlyAssigned = [...userDetails.currentAssigned]
      }
      currentlyAssigned.push({ productKey: product.key, currentAssignedKey: newDoc.id })
      const userRef = doc(db, `Users/${userDetails.key}`)
      await updateDoc(userRef, {
        currentAssigned: currentlyAssigned,
      })
      setLoading(false)
      toast.success('Check Out Successful')
      navigate('/history')
    } catch (error) {
      setLoading(false)
      toast.error('Failed check out')
      console.log(error)
    }
  }
  const handleCheckIn = async (product) => {
    try {
      setLoading(true)
      let currentlyAssignedKey = ''
      let currentlyAssigned = []
      if (userDetails.currentAssigned && userDetails.currentAssigned.length > 0) {
        userDetails.currentAssigned.map((item) => {
          if (item.productKey === product.key) {
            currentlyAssignedKey = item.currentAssignedKey
          } else {
            currentlyAssigned.push(item)
          }
        })
      }
      const userRef = doc(db, `Users/${userDetails.key}`)
      const docRef = doc(db, `AssignedHistory/${currentlyAssignedKey}`)
      await updateDoc(userRef, {
        currentAssigned: currentlyAssigned,
      })
      await updateDoc(docRef, {
        checkedInAt: new Date(),
      })
      setLoading(false)
      toast.success('Check In Successful')
      navigate('/history')
    } catch (error) {
      setLoading(false)
      toast.error('Failed check in')
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
            <strong>Products</strong>
            {state.user && state.user.role === 'admin' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <Link to="/products/add">
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
              <p className="text-body-secondary small">Find all products here</p>
              <CInputGroup size="sm" className="flex-nowrap" style={{ width: '30%' }}>
                <CInputGroupText id="addon-wrapping">
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Search by Item ID"
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
                    ID
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Title
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Created At
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Action
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {products ? (
                  products.map((product) => (
                    <CTableRow key={product.key}>
                      <CTableDataCell>
                        {product.image === '' ? (
                          <CAvatar color="secondary">{product.title[0]}</CAvatar>
                        ) : (
                          <CImage rounded src={product.image} width={150} height={100} />
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{product.id}</CTableDataCell>
                      <CTableDataCell>{product.title}</CTableDataCell>
                      <CTableDataCell>
                        {moment(product.createdAt.seconds * 1000).format('DD MMM, YYYY ddd')}
                      </CTableDataCell>
                      <CTableDataCell>
                        {state.user && state.user.role === 'admin' ? (
                          <>
                            <Link to={`/products/edit/${product.key}`}>
                              <CButton color="primary">Edit</CButton>
                            </Link>
                            <CButton
                              style={{ marginLeft: '10px' }}
                              color="danger"
                              onClick={() => handleDelete(product.key)}
                            >
                              Delete
                            </CButton>
                          </>
                        ) : userDetails ? (
                          <div>
                            {userDetails.currentAssigned &&
                            userDetails.currentAssigned.filter(
                              (item) => item.productKey === product.key,
                            ).length > 0 ? (
                              <CButton color="primary" onClick={() => handleCheckIn(product)}>
                                Check In
                              </CButton>
                            ) : (
                              <CButton color="primary" onClick={() => handleCheckOut(product)}>
                                Check Out
                              </CButton>
                            )}
                          </div>
                        ) : (
                          <CIcon icon={cilCart} />
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <h3>No products found</h3>
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

export default Products
