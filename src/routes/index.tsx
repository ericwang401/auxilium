import { createFileRoute } from '@tanstack/react-router'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import AllTab from '@/components/interfaces/home/AllTab.tsx'
import ReviewedTab from '@/components/interfaces/home/ReviewedTab.tsx'
import UnreviewedTab from '@/components/interfaces/home/UnreviewedTab.tsx'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <div className={'p-2 h-full'}>
            <Tabs className='h-full' defaultValue={'all'}>
                <TabsList>
                    <TabsTrigger value={'all'}>All</TabsTrigger>
                    <TabsTrigger value={'reviewed'}>Reviewed</TabsTrigger>
                    <TabsTrigger value={'unreviewed'}>Unreviewed</TabsTrigger>
                </TabsList>
                <AllTab />
                <ReviewedTab />
                <UnreviewedTab />
            </Tabs>
        </div>
    )
}
