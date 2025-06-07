import { createFileRoute, useNavigate } from '@tanstack/react-router'

import DropOverlay from '@/components/interfaces/home/DropOverlay.tsx'
import FileInput from '@/components/interfaces/home/FileInput.tsx'
import Toolbar from '@/components/ui/Navigation/Toolbar.tsx'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {

    return (
        <div className={'p-2 size-full'}>
            <DropOverlay />
            <FileInput />
        </div>
    )
}
