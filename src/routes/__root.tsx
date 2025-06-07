import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Toolbar from '@/components/ui/Navigation/Toolbar.tsx'

export const Route = createRootRoute({
    component: () => (
        <div className='flex h-screen flex-col'>
            <Toolbar />
            <main className='flex-1 overflow-hidden'>
                <Outlet />
            </main>
            <TanStackRouterDevtools />
        </div>
    ),
})
