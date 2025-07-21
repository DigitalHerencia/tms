'use client';

import * as React from 'react';
import { PricingTable } from '@clerk/nextjs';

export interface BillingPlanComparisonProps {
  /** true  = sidebar is collapsed (20 px)  
   *  false = sidebar is open      (64 px) */
  sidebarCollapsed: boolean;
}

/**
 * Pricing table that stays 3 cols when the sidebar is open,
 * but grows to as many columns as space allows when the sidebar is collapsed.
 */
export function BillingPlanComparison({ sidebarCollapsed }: BillingPlanComparisonProps) {
  /* choose grid style based on sidebar state */
  const listStyles: React.CSSProperties = sidebarCollapsed
    ? {
        /* sidebar closed ➜ let cards grow */
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
      }
    : {
        /* sidebar open ➜ pin at 3 fixed tracks */
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
      };

  return (
    <div className="w-full flex-shrink-0 py-8">
      <div className="w-full max-w-[1250px] px-4 mx-auto">
        <PricingTable
          appearance={{
            variables: {
              borderRadius: '12px',
              colorPrimary: '#3b82f6',
              colorText: 'white',
              colorBackground: 'black',
              colorBorder: '#e5e7eb',
            },
            elements: {
              /* ---- dynamic list wrapper ---- */
              list: {
                ...listStyles,
                WebkitOverflowScrolling: 'touch',
                scrollSnapType: 'x mandatory',
                paddingBottom: '0.5rem',
              },

              /* ---- individual cards ---- */
              planCard: {
                backgroundColor: 'black',
                borderColor: '#e5e7eb',
                borderWidth: '4px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                /* let grid control width; max keeps them tidy when they grow */
                width: '100%',
                maxWidth: '300px',
                scrollSnapAlign: 'start',
              },

              /* ---- rest unchanged ---- */
              header: {
                backgroundColor: 'transparent',
                color: 'white',
                fontSize: '1.75rem',
                fontWeight: 600,
                padding: '1rem 0',
              },
              planTitle: {
                color: '#3b82f6',
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
              },
              planPrice: {
                color: '#3b82f6',
                fontSize: '2rem',
                fontWeight: 800,
                marginBottom: '0.75rem',
              },
              planFeature: {
                color: '#d1d5db',
                fontSize: '0.875rem',
                marginBottom: '0.25rem',
              },
              button: {
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.5rem',
                fontWeight: 500,
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                marginTop: '1rem',
                transition: 'background 0.2s',
              },
            },
          }}
        />
      </div>
    </div>
  );
}
