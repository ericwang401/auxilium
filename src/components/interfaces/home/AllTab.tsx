import { TabsContent } from '@/components/ui/tabs.tsx'
import PaperCard from '@/components/interfaces/home/PaperCard.tsx'
import { useReviewStore } from '@/stores/review'

const AllTab = () => {
    const { papers } = useReviewStore()

    if (papers.length === 0) {
        return (
            <TabsContent className={'flex flex-col items-center justify-center p-8 text-muted-foreground'} value={'all'}>
                <p>No spreadsheet loaded. Use File &gt; Open spreadsheet to begin.</p>
            </TabsContent>
        )
    }

    return (
        <TabsContent className={'flex flex-col divide-y max-w-4xl m-auto'} value={'all'}>
            {papers.map((paper) => (
                <PaperCard key={paper.filename} paper={paper} />
            ))}
        </TabsContent>
    )
}

export default AllTab