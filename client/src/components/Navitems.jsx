import React from 'react'
import { sidebarItems } from '../../constants'

const Navitems = () => {
  return (
    <main className='nav-items bg-white'>
      <Link  to='/' className='link-logo'>
          <img src='/icons/logo2.png' alt='logo' className='size-[30px]'/>
          <h1>AlumniConnect</h1>
      </Link>
    </main>
  )
}

export default Navitems