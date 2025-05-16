import React from 'react'
import MainLayout from '../components/Home/MainLayout'
import SidebarSection from '../components/Home/SidebarSection'
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