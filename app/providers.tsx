'use client'

import { NextUIProvider } from '@nextui-org/react';
import { Suspense } from 'react';

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <Suspense>{children}</Suspense>
    </NextUIProvider>
  )
}
