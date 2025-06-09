import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Toolbar from '@/components/ui/Navigation/Toolbar.tsx'
import NotificationPermission from '@/components/ui/NotificationPermission'

export const Route = createRootRoute({
    component: () => (
        <div className='flex h-screen flex-col'>
            <NotificationPermission />
            <Toolbar />
            <main className='relative flex-1 overflow-hidden'>
                <Outlet />
            </main>
            {/* <TanStackRouterDevtools /> */}
        </div>
    ),
})
