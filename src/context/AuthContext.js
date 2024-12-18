import Cookies from 'js-cookie'
import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
  })
  useEffect(() => {
    const loadFromCookies = async () => {
      let data = Cookies.get('walnut_auth')
      if (data) {
        const as = JSON.parse(data)
        if (as && as.user) {
          setState({
            ...state,
            user: as.user,
          })
        }
      }
    }
    loadFromCookies()
  }, [])
  return <AuthContext.Provider value={{ state, setState }}>{children}</AuthContext.Provider>
}
const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }
