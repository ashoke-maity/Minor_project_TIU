import React from 'react'
import MainLayout from '../components/Home/web/MainLayout'
import SidebarSection from '../components/Home/web/SidebarSection'
import Header from '../components/layout/Header'
function Home() {
  return (
    <>
      <Header/>
      <MainLayout/>
      <SidebarSection/>
    </>
  )
}

export default Home