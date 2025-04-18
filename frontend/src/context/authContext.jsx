import React, {createContext, useContext, useEffect, useState} from 'react'
import axios from 'axios'

const userContext = createContext()

const authContext = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading ,setLoading] = useState(true)


    useEffect(() => {
        const verifyUser = async () => {            
          try {
                const token = localStorage.getItem("token");
                console.log("Initial Token Check:", token); // Add this
                if (token){
                const response = await axios.get("http://localhost:5000/api/auth/verify", {
                    headers: {
                        "Authorization" : `Bearer ${token}`
                    }
                })
                console.log("Verify Response:", response.data);
                if (response.data.success) {
                    setUser(response.data.user)
                }
                } else{
                    localStorage.removeItem('token');
                    setUser(null);
                    console.log("User State:", null);
                }
            } catch (error) {
                console.error("Verify Error:", error.response || error.message); // Add this
                localStorage.removeItem('token');
                if (error.response && !error.response.data.error){
                    setUser(null)
                }
            } finally{
                setLoading(false)
            }
            
        }
        verifyUser()
    }, [])

    const login = (user, token) => {
        console.log("Login Called - User:", user, "Token:", token); // Add this
        setUser(user);
        if (token) {
            localStorage.setItem("token", token);
            console.log("Token Stored in localStorage:", token);
          } else {
            console.log("No token provided to login function");
          }
      };
      
    const logout = () => {
        setUser(null)
        localStorage.removeItem("token")
        console.log("Logged out - User State:", null);
    }
  return (
    <userContext.Provider value={{user, login, logout, loading}}>
        {children}
    </userContext.Provider>
  )
}

export const useAuth = () => useContext(userContext)
export default authContext;
