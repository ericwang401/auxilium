import { useReviewStore } from '@/stores/review'
import { TabsContent } from '@/components/ui/tabs.tsx'
import PaperCard from '@/components/interfaces/home/PaperCard.tsx'

const ReviewedTab = () => {
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

    // Filter papers that have all fields reviewed
    const reviewedPapers = papers.filter(paper => {
        const completedReviews = researchFields.filter(
            field => getResearchDetailRating(paper.filename, field) !== null
        ).length
        return completedReviews === researchFields.length
    })

    if (reviewedPapers.length === 0) {
        return (
            <TabsContent
                className={
                    'text-muted-foreground flex flex-col items-center justify-center p-8'
                }
                value={'reviewed'}
            >
                <p>No papers have been fully reviewed yet.</p>
            </TabsContent>
        )
    }

    return (
        <TabsContent className={'overflow-y-auto h-full'} value={'reviewed'}>
            <div className='m-auto flex h-full max-w-4xl flex-col divide-y'>
                {reviewedPapers.map(paper => (
                    <PaperCard key={paper.filename} paper={paper} />
                ))}
            </div>
        </TabsContent>
    )
}

export default ReviewedTab