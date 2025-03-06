
import { useAppDispatch } from '../redux/store'
import { logout } from '../redux/authSlice'
import { useNavigate } from 'react-router-dom'
function Dashboard() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logout())
    navigate("/adminLogin")
  }
  return (
    <div>
      <h1 style={{color:"black"}}>Admin Dashboard</h1>
      <button onClick={handleLogout}>LOGOUT</button>
    </div>
  )
}

export default Dashboard
