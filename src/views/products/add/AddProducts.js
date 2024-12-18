import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'

const AddProducts = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add New Product</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <div className="mb-3">
                <CFormInput
                  type="email"
                  id="exampleFormControlInput1"
                  placeholder="Item Identity"
                />
              </div>
              <div className="mb-3">
                <CFormInput type="text" id="exampleFormControlInput2" placeholder="Title..." />
              </div>
              <div className="mb-3">
                <CFormTextarea
                  id="exampleFormControlTextarea1"
                  placeholder="Description..."
                  rows={3}
                ></CFormTextarea>
              </div>
              <div className="mb-3">
                <CFormInput
                  type="text"
                  id="exampleFormControlInput2"
                  placeholder="Barcode or serial..."
                />
              </div>
              <div className="mb-3">
                <CFormSelect aria-label="Default select example">
                  <option>Select User to Assign</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </CFormSelect>
              </div>
              <div className="mb-5">
                <CFormSelect aria-label="Default select example">
                  <option>Select Department to Assign</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </CFormSelect>
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
                <div style={{ display: 'flex', gap: 10 }}>
                  <label for="checkin">Checked In</label>
                  <input type="datetime-local" id="checkin" name="checkin" />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <label for="checkout">Checked Out</label>
                  <input type="datetime-local" id="checkout" name="checkout" />
                </div>
              </div>
              <CButton className="w-100" color="primary">
                Success
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddProducts
