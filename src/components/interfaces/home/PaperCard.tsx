import { useReviewStore } from '@/stores/review'
import type { ResearchRecord } from '@/types/spreadsheet'
import { Link } from '@tanstack/react-router'
import { Check, Hourglass } from 'lucide-react'

interface Props {
    paper: ResearchRecord
}

const PaperCard = ({ paper }: Props) => {
    const { getResearchDetailRating } = useReviewStore()

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

    // Count completed and total reviews
    const completedReviews = researchFields.filter(
        field => getResearchDetailRating(paper.filename, field) !== null
    ).length
    const totalReviews = researchFields.length

    return (
        <article className={'flex gap-4 py-5'}>
            <div className={'flex w-16 shrink-0 flex-col items-end'}>
                <dl className={'text-right text-xs'}>
                    <dd className='text-xl font-medium tracking-tight'>
                        {completedReviews}{' '}
                        <span className='mt-1 inline-block align-top text-xs font-normal'>
                            / {totalReviews}
                        </span>
                    </dd>
                    <dt>Reviews</dt>
                </dl>
                {completedReviews === totalReviews ? (
                    <Check className='mt-2 size-4 text-green-500' />
                ) : completedReviews > 0 ? (
                    <Hourglass className='mt-2 size-4 text-yellow-500' />
                ) : null}
            </div>
            <div className={'shrink grow'}>
                <div className='flex items-center gap-2'>
                    <Link
                        to={'/review/$paperId'}
                        params={{ paperId: paper.filename }}
                        className={'text-primary font-medium'}
                    >
                        {paper.title}
                    </Link>
                </div>
                <p className={'text-muted-foreground text-sm'}>
                    {paper.authors}
                </p>
                <p className={'text-secondary-foreground text-sm'}>
                    {paper.venue}. {paper.year}; doi: {paper.doi}
                </p>
            </div>
        </article>
    )
}

export default PaperCard
