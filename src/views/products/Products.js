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
import { cilPencil, cilSearch, cilTrash } from '@coreui/icons'
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
const Products = () => {
  const [products, setProducts] = useState([])
  const [lastVisible, setLastVisible] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])
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
  const findTitle = (str) => {
    const parts = str.split('-')
    return parts[1]
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
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/products/add">
                <CButton color="primary" shape="pill" size="sm">
                  Add new
                </CButton>
              </Link>
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
                    ID
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Title
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Assigned User
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Assigned Department
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Checked In
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Checked Out
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
                      <CTableDataCell>{product.id}</CTableDataCell>
                      <CTableDataCell>{product.title}</CTableDataCell>
                      <CTableDataCell>{findTitle(product.assignedUser)}</CTableDataCell>
                      <CTableDataCell>{findTitle(product.assignedDept)}</CTableDataCell>
                      <CTableDataCell>
                        {moment(product.checkedIn.seconds * 1000).format('DD MMM, YYYY ddd')}
                      </CTableDataCell>
                      <CTableDataCell>
                        {moment(product.checkedOut.seconds * 1000).format('DD MMM, YYYY ddd')}
                      </CTableDataCell>
                      <CTableDataCell style={{ display: 'flex', gap: 20 }}>
                        <Link to={`/products/edit/${product.key}`}>
                          <CIcon style={{ color: 'yellow' }} size="lg" icon={cilPencil} />
                        </Link>
                        <CIcon
                          style={{ color: 'red', cursor: 'pointer' }}
                          size="lg"
                          icon={cilTrash}
                          onClick={() => handleDelete(product.key)}
                        />
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
