import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Products = React.lazy(() => import('./views/products/Products'))
const AddProducts = React.lazy(() => import('./views/products/add/AddProducts'))
const Users = React.lazy(() => import('./views/users/Users'))
const Departments = React.lazy(() => import('./views/departments/Departments'))
const AddDepartments = React.lazy(() => import('./views/departments/add/AddDepartments'))
const EditDepartment = React.lazy(() => import('./views/departments/edit/EditDepartment'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/products', name: 'Products', element: Products },
  { path: '/products/add', name: 'Add Products', element: AddProducts },
  { path: '/users', name: 'Users', element: Users },
  { path: '/departments', name: 'Departments', element: Departments },
  { path: '/departments/add', name: 'Add Departments', element: AddDepartments },
  { path: '/departments/edit/:id', name: 'Edit Department', element: EditDepartment },
]

export default routes
