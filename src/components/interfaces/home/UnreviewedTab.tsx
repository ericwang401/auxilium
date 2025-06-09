import { useReviewStore } from '@/stores/review'
import { TabsContent } from '@/components/ui/tabs.tsx'
import PaperCard from '@/components/interfaces/home/PaperCard.tsx'

const UnreviewedTab = () => {
    const { papers, getResearchDetailRating } = useReviewStore()

    // Get all research fields that need to be reviewed
    const researchFields = [
        'researchGoal',
        'targetCondition',
        'hasSensorDevice',
        'deviceType',
        'category',
        'sensorType',
        'method',
        'placement',
        'measurementVariable',
        'benefits',
        'primaryPurpose',
        'performanceMetrics',
        'deviceLimitation',
        'measurementUnit',
        'measurementPrecision',
    ] as const

    // Filter papers that don't have all fields reviewed
    const unreviewedPapers = papers.filter(paper => {
        const completedReviews = researchFields.filter(
            field => getResearchDetailRating(paper.filename, field) !== null
        ).length
        return completedReviews < researchFields.length
    })

    if (unreviewedPapers.length === 0) {
        return (
            <TabsContent
                className={
                    'text-muted-foreground flex flex-col items-center justify-center p-8'
                }
                value={'unreviewed'}
            >
                <p>All papers have been fully reviewed.</p>
            </TabsContent>
        )
    }

    return (
        <TabsContent className={'overflow-y-auto h-full'} value={'unreviewed'}>
            <div className='m-auto flex h-full max-w-4xl flex-col divide-y'>
                {unreviewedPapers.map(paper => (
                    <PaperCard key={paper.filename} paper={paper} />
                ))}
            </div>
        </TabsContent>
    )
}

export default UnreviewedTab