import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
// Optional: If using a utility like clsx, otherwise remove it
import { cn } from '../lib/utils'; // Or replace with your logic

const Header = ({ title, description, ctaUrl, ctaText }) => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <header className="header flex flex-col gap-2 sm:gap-4 md:flex-row md:items-center md:justify-between pb-3 sm:pb-5 border-b border-gray-100">
      <article className="flex-1">
        <h1 className={
          cn(
            'text-dark-100',
            isDashboard
              ? 'text-lg sm:text-xl lg:text-2xl font-semibold'
              : 'text-xl sm:text-2xl lg:text-4xl font-bold'
          )
        }>
          {title}
        </h1>
        {description && (
          <p className={
            cn(
              'text-gray-500 font-normal mt-1',
              isDashboard
                ? 'text-xs sm:text-sm lg:text-base'
                : 'text-sm sm:text-base lg:text-lg'
            )
          }>
            {description}
          </p>
        )}
      </article>

      {ctaText && ctaUrl && (
        <Link to={ctaUrl} className="mt-3 md:mt-0">
          <ButtonComponent 
            type="button" 
            cssClass="e-primary !h-9 sm:!h-10 lg:!h-11 !w-full md:w-[220px] flex items-center justify-center gap-2"
          >
            <img
              src="/assets/icons/plus.svg"
              alt="plus"
              className="size-4 lg:size-5"
            />
            <span className="text-sm lg:text-base font-medium text-white">{ctaText}</span>
          </ButtonComponent>
        </Link>
      )}
    </header>
  );
};

export default Header;
