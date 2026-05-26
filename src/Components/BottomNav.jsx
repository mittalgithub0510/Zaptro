import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Grid, Info, Phone, User } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

const BottomNav = () => {
  return (
    <div className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => isActive ? 'bottom-nav-item active' : 'bottom-nav-item'}>
        <Home size={24} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/product" className={({ isActive }) => isActive ? 'bottom-nav-item active' : 'bottom-nav-item'}>
        <Grid size={24} />
        <span>Category</span>
      </NavLink>

      <NavLink to="/about" className={({ isActive }) => isActive ? 'bottom-nav-item active' : 'bottom-nav-item'}>
        <Info size={24} />
        <span>About</span>
      </NavLink>

      <NavLink to="/contact" className={({ isActive }) => isActive ? 'bottom-nav-item active' : 'bottom-nav-item'}>
        <Phone size={24} />
        <span>Contact</span>
      </NavLink>

      <div className="bottom-nav-item account-tab">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bottom-nav-signin-btn">
              <User size={24} />
              <span>Account</span>
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="bottom-nav-userbtn">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: { width: "24px", height: "24px", margin: "0 auto" }
                }
              }} 
            />
            <span>Account</span>
          </div>
        </SignedIn>
      </div>
    </div>
  )
}

export default BottomNav
