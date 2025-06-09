import type { ResearchRecord } from '@/types/spreadsheet'
import { Link } from '@tanstack/react-router'

interface Props {
    paper: ResearchRecord
}

const PaperCard = ({ paper }: Props) => {
    return (
        <article className={'flex gap-4 py-5'}>
            <div className={'flex w-16 flex-col items-end pt-1 shrink-0'}>
                <dl className={'text-xs text-right space-y-2'}>
                    <dd>{paper.citationCount}</dd>
                    <dt>
                        Citations
                    </dt>
                </dl>
            </div>
            <div className={'shrink grow'}>
                <Link to={'/review/$paperId'} params={{paperId: paper.filename}} className={'font-medium text-primary'}>
                    {paper.title}
                </Link>
                <p className={'text-sm text-muted-foreground'}>{paper.authors}</p>
                <p className={'text-sm text-secondary-foreground'}>{paper.venue}. {paper.year}; doi: {paper.doi}</p>
            </div>
        </article>
    )
}

export default PaperCard
