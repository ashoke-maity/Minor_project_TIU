import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
// Optional: If using a utility like clsx, otherwise remove it
import { cn } from '../lib/utils'; // Or replace with your logic

const Header = ({ title, description, ctaUrl, ctaText }) => {
  const location = useLocation();

  return (
    <header className="header flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <article>
        <h1 className={
          cn(
            'text-dark-100',
            location.pathname === '/'
              ? 'text-2xl md:text-4xl font-bold'
              : 'text-xl md:text-2xl font-semibold'
          )
        }>
          {title}
        </h1>
        <p className={
          cn(
            'text-gray-100 font-normal',
            location.pathname === '/'
              ? 'text-base md:text-lg'
              : 'text-sm md:text-lg'
          )
        }>
          {description}
        </p>
      </article>

      {ctaText && ctaUrl && (
        <Link to={ctaUrl} className="mt-4 md:mt-0">
          <ButtonComponent type="button" cssClass="e-primary !h-11 !w-full md:w-[240px] flex items-center justify-center gap-2">
            <img
              src="/assets/icons/plus.svg"
              alt="plus"
              className="size-5"
            />
            <span className="p-16-semibold text-white">{ctaText}</span>
          </ButtonComponent>
        </Link>
      )}
    </header>
  );
};

export default Header;
