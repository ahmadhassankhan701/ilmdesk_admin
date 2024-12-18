import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'
import { useAuth } from '../context/AuthContext'
import CIcon from '@coreui/icons-react'
export const AppSidebarNav = ({ items }) => {
  const { state } = useAuth()
  const navLink = (name, icon, badge, indent = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto" size="sm">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })}
            {...rest}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  const navGroup = (item, index) => {
    const { component, name, icon, items, to, ...rest } = item
    const Component = component
    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index, true),
        )}
      </Component>
    )
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px',
        }}
      >
        <div className="card mb-3" style={{ width: '95%', backgroundColor: 'rgb(41.5, 48, 61)' }}>
          <div className="row g-0">
            <div className="col-md-9">
              <div className="card-body">
                <h6 className="card-title">{state && state.user ? state.user.name : 'John Doe'}</h6>
                <p className="card-text">{state && state.user ? state.user.role : 'User'}</p>
              </div>
            </div>
            <div
              className="col-md-3"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <div className="avatar">
                <img className="avatar-img" src="/src/assets/images/avatars/8.jpg" alt="favicon" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <CSidebarNav as={SimpleBar}>
        {items &&
          items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
      </CSidebarNav>
    </div>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
