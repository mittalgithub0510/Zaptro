import { Link, NavLink } from 'react-router-dom'
import { MapPin, ShoppingCart, X } from 'lucide-react'
import { RiArrowDownSFill } from "react-icons/ri"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { useState, useContext } from 'react'
import { CartContext } from '../Context/CartContext'

const Navbar = ({ location, setLocation, getLocation }) => {

  const [openDropdown, setOpenDropdown] = useState(false)
  const [manualInput, setManualInput] = useState('')

  const toggleDropDown = () => {
    setOpenDropdown(!openDropdown)
  }

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      setLocation({ manualAddress: manualInput.trim() })
      setOpenDropdown(false)
      setManualInput('')
    }
  }

  // ✅ Get cart quantity from context
  const { totalQuantity } = useContext(CartContext)

  return (
    <div className='Navbar'>

      {/* LEFT SIDE */}
      <div className='nav-left'>

        <div className='zaptro'>
          <Link to='/'>
            <span className='aptro'>
              <span className='Z'>Z</span>aptro
            </span>
          </Link>
        </div>

        <div className='address'>
          <div style={{ cursor: "pointer", display: "flex", alignItems: "center" }} onClick={toggleDropDown}>
            <MapPin size={22} />
          </div>

          <span>
            {location ? (
              <div onClick={toggleDropDown} style={{ cursor: "pointer" }}>
                <p style={{ fontWeight: location?.manualAddress ? '500' : 'normal' }}>
                  {location?.manualAddress ||
                   location?.city ||
                   location?.town ||
                   location?.village ||
                   location?.county ||
                   location?.suburb ||
                   "Unknown City"}
                </p>
                {(!location?.manualAddress || location?.state || location?.country) && (
                  <p>
                    {[location?.state, location?.country].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            ) : (
              <span onClick={toggleDropDown} style={{ cursor: "pointer" }}>
                Add address
              </span>
            )}
          </span>

          <button
            className='RiArrowDownSFill'
            onClick={toggleDropDown}
          >
            <RiArrowDownSFill size={16} />
          </button>

          {openDropdown && (
            <div className='opendropdown'>
              <h3 className='opendroplocation'>
                Change Location
                <span
                  onClick={toggleDropDown}
                  className='X'
                >
                  <X size='15' />
                </span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <input 
                  type='text' 
                  placeholder='Enter delivery address...' 
                  value={manualInput} 
                  onChange={(e) => setManualInput(e.target.value)} 
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleManualSubmit();
                  }}
                />
                <button
                  onClick={handleManualSubmit}
                  style={{
                    padding: '8px',
                    backgroundColor: '#FF6B6B',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    width: '100%'
                  }}
                >
                  Save Address
                </button>
              </div>

              <div style={{ textAlign: 'center', margin: '10px 0', fontSize: '12px', color: '#888' }}>
                OR
              </div>

              <button
                id='updatelocationBtn'
                onClick={() => {
                  getLocation()
                  setOpenDropdown(false)
                }}
                style={{ width: '100%' }}
              >
                Use GPS / Device Location
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className='nav-right'>

        <div className='headingtags'>
          <NavLink
            to='/'
            end
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Home
          </NavLink>

          <NavLink
            to='/product'
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Products
          </NavLink>

          <NavLink
            to='/about'
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            About
          </NavLink>

          <NavLink
            to='/contact'
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Contact
          </NavLink>
        </div>

        {/* ✅ CART ICON WITH DYNAMIC BADGE */}
        <div className="cart-icon">
          <Link to='/cart'>
            <ShoppingCart size={25} />
          </Link>

          {totalQuantity > 0 && (
            <span className="cartitems">
              {totalQuantity}
            </span>
          )}
        </div>

        {/* SIGN IN */}
        <div className="signin">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="signInButton">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    width: "35px",
                    height: "35px",
                    border: "1px solid black",
                  }
                }
              }}
            />
          </SignedIn>
        </div>

      </div>
    </div>
  )
}

export default Navbar