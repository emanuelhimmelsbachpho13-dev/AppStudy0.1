import React from 'react';
import { NavLink as RouterNavLink, NavLinkProps as RouterNavLinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps extends RouterNavLinkProps {
  activeClassName?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({
  children,
  className,
  activeClassName,
  ...props
}) => {
  return (
    <RouterNavLink
      className={({ isActive }) =>
        cn(
          typeof className === 'function' ? className({ isActive }) : className,
          isActive && activeClassName
        )
      }
      {...props}
    >
      {children}
    </RouterNavLink>
  );
};
