import { SidebarComponent } from '@syncfusion/ej2-react-navigations';
import React from 'react';
import { Link } from 'react-router-dom';
import Navitems from './Navitems';

const MobileSidebar = () => {
  const sidebarRef = React.useRef(null);

  return (
    <div className='mobile-sidebar wrapper'>
      <header>
        <Link to="/">
          <img
            src='/icons/logo3.png'
            alt='logo'
            className='size-[30px]'
          />
          <h1>AlumniConnect</h1>
        </Link>

        <button onClick={() => sidebarRef.current.toggle()}>
          <img
            src='/icons/menu.svg'
            alt='menu'
            className='size-7'
          />
        </button>
      </header>

      <SidebarComponent
        width={270}
        ref={sidebarRef}
        created={() => sidebarRef.current.hide()}
        closeOnDocumentClick={true}
        showBackdrop={true}
        type='Over'
      >
        <Navitems />
      </SidebarComponent>
    </div>
  );
};

export default MobileSidebar;
