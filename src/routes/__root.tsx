import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Toolbar from '@/components/ui/Navigation/Toolbar.tsx'

export const Route = createRootRoute({
    component: () => (
        <>
            <Toolbar />
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
})
