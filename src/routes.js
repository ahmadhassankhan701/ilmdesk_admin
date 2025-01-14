import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Products = React.lazy(() => import('./views/products/Products'))
const AddProducts = React.lazy(() => import('./views/products/add/AddProducts'))
const Users = React.lazy(() => import('./views/users/Users'))
const UpdatePassword = React.lazy(() => import('./views/users/updatepass/UpdatePassword'))
const History = React.lazy(() => import('./views/assignments/History'))
const Departments = React.lazy(() => import('./views/departments/Departments'))
const AddDepartments = React.lazy(() => import('./views/departments/add/AddDepartments'))
const EditProduct = React.lazy(() => import('./views/products/edit/EditProduct'))
const EditDepartment = React.lazy(() => import('./views/departments/edit/EditDepartment'))
const EditUser = React.lazy(() => import('./views/users/edit/EditUser'))
const CreateUser = React.lazy(() => import('./views/users/new/CreateUser'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/tools', name: 'Tools', element: Products },
  { path: '/history', name: 'History', element: History },
  { path: '/tools/add', name: 'Add Tools', element: AddProducts },
  { path: '/tools/edit/:id', name: 'Edit Tools', element: EditProduct },
  { path: '/users', name: 'Users', element: Users },
  { path: '/users/update-password', name: 'Update Password', element: UpdatePassword },
  { path: '/users/new', name: 'Create User', element: CreateUser },
  { path: '/users/edit/:id', name: 'Edit User', element: EditUser },
  { path: '/departments', name: 'Departments', element: Departments },
  { path: '/departments/add', name: 'Add Departments', element: AddDepartments },
  { path: '/departments/edit/:id', name: 'Edit Department', element: EditDepartment },
]

export default routes
