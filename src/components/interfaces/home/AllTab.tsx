import { useReviewStore } from '@/stores/review'

import PaperCard from '@/components/interfaces/home/PaperCard.tsx'

import { TabsContent } from '@/components/ui/tabs.tsx'

const AllTab = () => {
    const { papers } = useReviewStore()

    if (papers.length === 0) {
        return (
            <TabsContent
                className={
                    'text-muted-foreground flex flex-col items-center justify-center p-8'
                }
                value={'all'}
            >
                <p>
                    No spreadsheet loaded. Use File &gt; Open spreadsheet to
                    begin.
                </p>
            </TabsContent>
        )
    }

    return (
        <TabsContent className={'overflow-y-auto h-full'} value={'all'}>
            <div className='m-auto flex h-full max-w-4xl flex-col divide-y'>
                {papers.map(paper => (
                    <PaperCard key={paper.filename} paper={paper} />
                ))}
            </div>
        </TabsContent>
    )
}

export default AllTab
