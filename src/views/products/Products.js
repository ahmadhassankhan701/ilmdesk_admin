import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableCaption,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPencil, cilTrash } from '@coreui/icons'

const Products = () => {
  return (
    <CRow>
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
            <p className="text-body-secondary small">Find all added products here</p>
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
                    User
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Comapny
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Assigned at
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="w-20">
                    Action
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>1</CTableDataCell>
                  <CTableDataCell>Ceiling Bulb</CTableDataCell>
                  <CTableDataCell>John Doe</CTableDataCell>
                  <CTableDataCell>John Cop</CTableDataCell>
                  <CTableDataCell>Thursday</CTableDataCell>
                  <CTableDataCell style={{ display: 'flex', gap: 20 }}>
                    <Link to="/utilities/companies">
                      <CIcon style={{ color: 'yellow' }} size="lg" icon={cilPencil} />
                    </Link>
                    <Link to="/utilities/companies">
                      <CIcon style={{ color: 'red' }} size="lg" icon={cilTrash} />
                    </Link>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Products
