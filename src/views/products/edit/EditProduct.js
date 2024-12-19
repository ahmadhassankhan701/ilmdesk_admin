import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import moment from 'moment'
const EditProduct = () => {
  const { id } = useParams()
  const [displayCheckedTime, setDisplayCheckedTime] = useState({
    checkedIn: '',
    checkedOut: '',
  })
  const [checkedIn, setCheckedIn] = useState('')
  const [checkedOut, setCheckedOut] = useState('')
  const [product, setProduct] = useState({
    id: '',
    title: '',
    desc: '',
    barcode: '',
    assignedUser: '',
    assignedDept: '',
  })
  const [depts, setDepts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetchProduct()
    fetchDepts()
    fetchUsers()
  }, [id])
  const fetchProduct = async () => {
    try {
      setLoading(true)
      const docRef = doc(db, `Products/${id}`)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const docData = docSnap.data()
        setProduct({
          ...product,
          id: docData.id,
          title: docData.title,
          desc: docData.desc,
          barcode: docData.barcode,
          assignedUser: docData.assignedUser,
          //   assignedUser: findTitle(docData.assignedUser),
          assignedDept: docData.assignedDept,
          //   assignedDept: findTitle(docData.assignedDept),
        })
        setDisplayCheckedTime({
          ...displayCheckedTime,
          checkedIn: docData.checkedIn,
          checkedOut: docData.checkedOut,
        })
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error fetching product')
      console.log(error)
    }
  }
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const docRef = collection(db, 'Users')
      const docSnap = await getDocs(docRef)
      if (docSnap.size == 0) {
        setLoading(false)
        toast.info('No user found')
        return
      }
      let userItems = []
      docSnap.forEach((item) => {
        userItems.push({ key: item.id, title: item.data().name })
      })
      setUsers(userItems)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error fetching users')
      console.log(error)
    }
  }
  const fetchDepts = async () => {
    try {
      setLoading(true)
      const docRef = collection(db, 'Departments')
      const docSnap = await getDocs(docRef)
      if (docSnap.size == 0) {
        setLoading(false)
        toast.info('No department found')
        return
      }
      let deptItems = []
      docSnap.forEach((item) => {
        deptItems.push({ key: item.id, title: item.data().deptTitle })
      })
      setDepts(deptItems)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error fetching departments')
      console.log(error)
    }
  }
  const handleSubmit = async () => {
    if (
      !product.id ||
      !product.title ||
      !product.desc ||
      !product.barcode ||
      !product.assignedUser ||
      !product.assignedDept
    ) {
      toast.error('All fields are required')
      return
    }
    try {
      setLoading(true)
      const docRef = doc(db, `Products/${id}`)
      await updateDoc(docRef, {
        ...product,
        checkedIn: checkedIn == '' ? displayCheckedTime.checkedIn : new Date(checkedIn),
        checkedOut: checkedOut == '' ? displayCheckedTime.checkedOut : new Date(checkedOut),
        updatedAt: new Date(),
      })
      setLoading(false)
      toast.success('Product updated successfully!')
    } catch (error) {
      setLoading(false)
      toast.error('Failed updating product')
      console.log(error)
    }
  }
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add New Product</strong>
          </CCardHeader>
          <CCardBody>
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
            <CForm>
              <div className="mb-3">
                <CFormInput
                  type="text"
                  id="exampleFormControlInput1"
                  placeholder="Item Identity"
                  value={product.id}
                  onChange={(e) => setProduct({ ...product, id: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <CFormInput
                  type="text"
                  id="exampleFormControlInput2"
                  placeholder="Title..."
                  value={product.title}
                  onChange={(e) => setProduct({ ...product, title: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <CFormTextarea
                  id="exampleFormControlTextarea1"
                  placeholder="Description..."
                  rows={3}
                  value={product.desc}
                  onChange={(e) => setProduct({ ...product, desc: e.target.value })}
                ></CFormTextarea>
              </div>
              <div className="mb-3">
                <CFormInput
                  type="text"
                  id="exampleFormControlInput2"
                  placeholder="Barcode or serial..."
                  value={product.barcode}
                  onChange={(e) => setProduct({ ...product, barcode: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <CFormSelect
                  aria-label="Default select example"
                  value={product.assignedUser}
                  onChange={(e) => setProduct({ ...product, assignedUser: e.target.value })}
                >
                  <option>Select User to Assign</option>
                  {users &&
                    users.map((user) => (
                      <option key={user.key} value={`${user.key}-${user.title}`}>
                        {user.title}
                      </option>
                    ))}
                </CFormSelect>
              </div>
              <div className="mb-5">
                <CFormSelect
                  aria-label="Default select example"
                  value={product.assignedDept}
                  onChange={(e) => setProduct({ ...product, assignedDept: e.target.value })}
                >
                  <option>Select Department to Assign</option>
                  {depts &&
                    depts.map((dept) => (
                      <option key={dept.key} value={`${dept.key}-${dept.title}`}>
                        {dept.title}
                      </option>
                    ))}
                </CFormSelect>
              </div>
              <div
                className="mb-2"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', gap: 10 }}>
                  <label htmlFor="checked">Checked In:</label>
                  <input
                    type="datetime-local"
                    id="checked"
                    name="checked"
                    value={checkedIn}
                    onChange={(e) => setCheckedIn(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <label htmlFor="checkedout">Checked Out:</label>
                  <input
                    type="datetime-local"
                    id="checkedout"
                    name="checkedout"
                    value={checkedOut}
                    onChange={(e) => setCheckedOut(e.target.value)}
                  />
                </div>
              </div>
              <div
                className="mb-5"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                <p>
                  Current Checked In:{' '}
                  {moment(displayCheckedTime.checkedIn.seconds * 1000).format('DD MMM, YYYY ddd')}
                </p>
                <p>
                  Current Checked Out:{' '}
                  {moment(displayCheckedTime.checkedOut.seconds * 1000).format('DD MMM, YYYY ddd')}
                </p>
              </div>
              <CButton className="w-100" color="primary" onClick={handleSubmit}>
                Update
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EditProduct
