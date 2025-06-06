import { createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button.tsx'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <div className='p-2'>
            <Button>Lmao</Button>
            <h1 className={'text-xl'}>test</h1>
        </div>
    )
}
