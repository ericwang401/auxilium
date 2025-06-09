import { useReviewStore } from '@/stores/review'
import type { ResearchRecordField } from '@/types/spreadsheet'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useParams } from '@tanstack/react-router'
import {
    Ban,
    Check,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Hourglass,
    Star,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { z } from 'zod'

import { Button } from '@/components/ui/button.tsx'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable.tsx'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.tsx'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs.tsx'

const paperSearchSchema = z.object({
    filter: z.enum(['all', 'reviewed', 'unreviewed']).default('all'),
})

export const Route = createFileRoute('/review/$paperId')({
    component: RouteComponent,
    validateSearch: paperSearchSchema,
    loader: ({ params }) => {
        const { paperId } = params
        const { papers } = useReviewStore.getState()
        const paper = papers.find(p => p.filename === paperId)

        if (!paper) {
            throw redirect({
                to: '/',
            })
        }

        return paper
    },
})

// Define research fields that need to be reviewed
const researchFields: ResearchRecordField[] = [
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
]

function RouteComponent() {
    const {
        currentPaper,
        currentPaperNumber,
        totalPapers,
        canGoToNext,
        canGoToPrevious,
        setCurrentPaperIndex,
        setCurrentPaper,
        rateResearchDetail,
        getResearchDetailRating,
        papers,
    } = useReviewStore()

    const [selectedField, setSelectedField] =
        useState<ResearchRecordField>('researchGoal')
    const [activeTab, setActiveTab] = useState('quotes')

    // Get the paperId from the route params
    const { paperId } = useParams({ from: '/review/$paperId' })

    // Set the current paper when the route changes
    useEffect(() => {
        if (paperId) {
            setCurrentPaper(paperId)
        }
    }, [paperId, setCurrentPaper])

    // Reset selected field when paper changes
    useEffect(() => {
        setSelectedField('researchGoal')
    }, [currentPaper])

    // Add keyboard event handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Tab switching shortcuts
            if (e.key.toLowerCase() === 'q') {
                setActiveTab('quotes')
            } else if (e.key.toLowerCase() === 't') {
                setActiveTab('tables')
            } else if (e.key.toLowerCase() === 'r') {
                setActiveTab('reasoning')
            }

            // Star rating shortcuts (1-5)
            if (e.key >= '1' && e.key <= '5' && currentPaper) {
                const rating = parseInt(e.key)
                rateResearchDetail(currentPaper.filename, selectedField, rating)
            }

            // Research detail navigation
            if (e.key === 'ArrowUp') {
                const currentIndex = researchFields.indexOf(selectedField)
                if (currentIndex > 0) {
                    setSelectedField(researchFields[currentIndex - 1])
                }
            } else if (e.key === 'ArrowDown') {
                const currentIndex = researchFields.indexOf(selectedField)
                if (currentIndex < researchFields.length - 1) {
                    setSelectedField(researchFields[currentIndex + 1])
                }
            }

            // Paper navigation
            if (e.key === 'ArrowLeft' && canGoToPrevious) {
                setCurrentPaperIndex(currentPaperNumber - 2)
            } else if (e.key === 'ArrowRight' && canGoToNext) {
                setCurrentPaperIndex(currentPaperNumber)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedField, canGoToPrevious, canGoToNext, currentPaperNumber, setCurrentPaperIndex, currentPaper, rateResearchDetail])

    if (!currentPaper) {
        return null // The loader will handle the redirect
    }

    const currentRating = getResearchDetailRating(
        currentPaper.filename,
        selectedField
    )

    return (
        <div className='flex h-full flex-col'>
            <div className={'flex shrink-0 gap-12 border-b px-3 pb-2'}>
                <div className={'grow truncate'}>
                    <h3
                        className={
                            'truncate text-lg leading-relaxed font-medium'
                        }
                    >
                        {currentPaper.title}
                    </h3>
                    <p
                        className={
                            'text-muted-foreground text-sm leading-relaxed'
                        }
                    >
                        <span
                            className={
                                'inline-block max-w-lg truncate align-middle'
                            }
                        >
                            {currentPaper.authors}
                        </span>{' '}
                        &middot; {currentPaper.venue} &middot; doi:{' '}
                        {currentPaper.doi}
                    </p>
                </div>
                <div className={'flex shrink-0 flex-col gap-1'}>
                    <div className={'flex gap-4'}>
                        <p className={'relative text-2xl font-medium'}>
                            <span>{currentPaperNumber}</span>
                            <span
                                className={
                                    'mt-1 ml-1.5 inline-block align-top text-xs'
                                }
                            >
                                / {totalPapers}
                            </span>
                        </p>
                        <div className={'flex gap-1'}>
                            <Button
                                variant={'outline'}
                                size={'icon'}
                                onClick={() => setCurrentPaperIndex(0)}
                                disabled={!canGoToPrevious}
                            >
                                <ChevronsLeft />
                            </Button>
                            <Button
                                variant={'outline'}
                                size={'icon'}
                                onClick={() =>
                                    setCurrentPaperIndex(currentPaperNumber - 2)
                                }
                                disabled={!canGoToPrevious}
                            >
                                <ChevronLeft />
                            </Button>
                            <Button
                                variant={'outline'}
                                size={'icon'}
                                onClick={() =>
                                    setCurrentPaperIndex(currentPaperNumber)
                                }
                                disabled={!canGoToNext}
                            >
                                <ChevronRight />
                            </Button>
                            <Button
                                variant={'outline'}
                                size={'icon'}
                                onClick={() =>
                                    setCurrentPaperIndex(totalPapers - 1)
                                }
                                disabled={!canGoToNext}
                            >
                                <ChevronsRight />
                            </Button>
                        </div>
                    </div>
                    <dl
                        className={
                            'flex items-center justify-end gap-2.5 text-sm'
                        }
                    >
                        <div className='flex items-center gap-0.75'>
                            <dd>{papers.filter(paper => {
                                const completedReviews = researchFields.filter(
                                    (field: ResearchRecordField) => getResearchDetailRating(paper.filename, field) !== null
                                ).length
                                return completedReviews === researchFields.length
                            }).length}</dd>
                            <dt aria-label={'Number of reviewed papers'}>
                                <Check className={'size-4.5'} />
                            </dt>
                        </div>
                        <div className='flex items-center gap-1.5'>
                            <dd>{papers.filter(paper => {
                                const completedReviews = researchFields.filter(
                                    (field: ResearchRecordField) => getResearchDetailRating(paper.filename, field) !== null
                                ).length
                                return completedReviews < researchFields.length
                            }).length}</dd>
                            <dt aria-label={'Number of unreviewed papers'}>
                                <Hourglass className={'size-3.5'} />
                            </dt>
                        </div>
                    </dl>
                </div>
            </div>
            <ResizablePanelGroup direction='horizontal'>
                <ResizablePanel defaultSize={50}>
                    <Select
                        value={selectedField}
                        onValueChange={value =>
                            setSelectedField(value as ResearchRecordField)
                        }
                    >
                        <SelectTrigger
                            className={
                                'focus-visible:border-input w-full rounded-none border-x-0 border-t-0 shadow-none focus-visible:ring-0'
                            }
                        >
                            <SelectValue placeholder='Select a research detail' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='researchGoal' className="flex items-center justify-between">
                                <span>Research Goal</span>
                                {getResearchDetailRating(currentPaper.filename, 'researchGoal') !== null ? (
                                    <Check className="size-4 text-primary ml-2" />
                                ) : (
                                    <Hourglass className="size-4 text-orange-500 ml-2" />
                                )}
                            </SelectItem>
                            <SelectItem value='targetCondition' className="flex items-center justify-between">
                                <span>Target condition</span>
                                {getResearchDetailRating(currentPaper.filename, 'targetCondition') !== null ? (
                                    <Check className="size-4 text-primary ml-2" />
                                ) : (
                                    <Hourglass className="size-4 text-orange-500 ml-2" />
                                )}
                            </SelectItem>
                            <SelectItem value='hasSensorDevice' className="flex items-center justify-between">
                                <span>Sensor, device, imaging technique, or labratory testing mentioned?</span>
                                {getResearchDetailRating(currentPaper.filename, 'hasSensorDevice') !== null ? (
                                    <Check className="size-4 text-primary ml-2" />
                                ) : (
                                    <Hourglass className="size-4 text-orange-500 ml-2" />
                                )}
                            </SelectItem>
                            <SelectItem value='deviceType' className="flex items-center justify-between">
                                <span>Device / sensor / technique/ test/ inspection type</span>
                                {getResearchDetailRating(currentPaper.filename, 'deviceType') !== null ? (
                                    <Check className="size-4 text-primary ml-2" />
                                ) : (
                                    <Hourglass className="size-4 text-orange-500 ml-2" />
                                )}
                            </SelectItem>
                            <SelectItem value='category' className="flex items-center justify-between">
                                <span>Category</span>
                                {getResearchDetailRating(currentPaper.filename, 'category') !== null ? (
                                    <Check className="size-4 text-primary ml-2" />
                                ) : (
                                    <Hourglass className="size-4 text-orange-500 ml-2" />
                                )}
                            </SelectItem>
                            <SelectItem value='sensorType' className="flex items-center justify-between">
                                <span>Sensor Type</span>
                                {getResearchDetailRating(currentPaper.filename, 'sensorType') !== null ? (
                                    <Check className="size-4 text-primary ml-2" />
                                ) : (
                                    <Hourglass className="size-4 text-orange-500 ml-2" />
                                )}
                            </SelectItem>
                            <SelectItem value='method' className="flex items-center justify-between">
                                <span>Method</span>
                                {getResearchDetailRating(currentPaper.filename, 'method') !== null ? (
                                    <Check className="size-4 text-primary ml-2" />
                                ) : (
                                    <Hourglass className="size-4 text-orange-500 ml-2" />
                                )}
                            </SelectItem>
                            <SelectItem value='placement' className="flex items-center justify-between">
                                <span>Placement</span>
                                {getResearchDetailRating(currentPaper.filename, 'placement') !== null ? (
                                    <Check className="size-4 text-primary ml-2" />
                                ) : (
                                    <Hourglass className="size-4 text-orange-500 ml-2" />
                                )}
                            </SelectItem>
                            <SelectItem value='measurementVariable' className="flex items-center justify-between">
                                <span>Measurement Variable</span>
                                {getResearchDetailRating(currentPaper.filename, 'measurementVariable') !== null ? (
                                    <Check className="size-4 text-primary ml-2" />
                                ) : (
                                    <Hourglass className="size-4 text-orange-500 ml-2" />
                                )}
                            </SelectItem>
                            <SelectItem value='benefits' className="flex items-center justify-between">
                                <span>Benefits of use</span>
                                {getResearchDetailRating(currentPaper.filename, 'benefits') !== null ? (
                                    <Check className="size-4 text-primary ml-2" />
                                ) : (
                                    <Hourglass className="size-4 text-orange-500 ml-2" />
                                )}
                            </SelectItem>
                            <SelectItem value='primaryPurpose' className="flex items-center justify-between">
                                <span>Primary Purpose</span>
                                {getResearchDetailRating(currentPaper.filename, 'primaryPurpose') !== null ? (
                                    <Check className="size-4 text-primary ml-2" />
                                ) : (
                                    <Hourglass className="size-4 text-orange-500 ml-2" />
                                )}
                            </SelectItem>
                            <SelectItem value='performanceMetrics' className="flex items-center justify-between">
                                <span>Performance Metrics</span>
                                {getResearchDetailRating(currentPaper.filename, 'performanceMetrics') !== null ? (
                                    <Check className="size-4 text-primary ml-2" />
                                ) : (
                                    <Hourglass className="size-4 text-orange-500 ml-2" />
                                )}
                            </SelectItem>
                            <SelectItem value='deviceLimitation' className="flex items-center justify-between">
                                <span>Device Limitation</span>
                                {getResearchDetailRating(currentPaper.filename, 'deviceLimitation') !== null ? (
                                    <Check className="size-4 text-primary ml-2" />
                                ) : (
                                    <Hourglass className="size-4 text-orange-500 ml-2" />
                                )}
                            </SelectItem>
                            <SelectItem value='measurementUnit' className="flex items-center justify-between">
                                <span>Measurement Unit</span>
                                {getResearchDetailRating(currentPaper.filename, 'measurementUnit') !== null ? (
                                    <Check className="size-4 text-primary ml-2" />
                                ) : (
                                    <Hourglass className="size-4 text-orange-500 ml-2" />
                                )}
                            </SelectItem>
                            <SelectItem value='measurementPrecision' className="flex items-center justify-between">
                                <span>Measurement Precision</span>
                                {getResearchDetailRating(currentPaper.filename, 'measurementPrecision') !== null ? (
                                    <Check className="size-4 text-primary ml-2" />
                                ) : (
                                    <Hourglass className="size-4 text-orange-500 ml-2" />
                                )}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <div
                        className={
                            'h-full overflow-y-auto p-2 pb-36 [&_ul]:list-disc [&_ul]:pl-5'
                        }
                    >
                        <Markdown>{currentPaper[selectedField]}</Markdown>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className='h-full'
                    >
                        <TabsList
                            className={
                                '[&_button[data-state=active]]:border-foreground bg-transparent [&_button[data-state=active]]:border [&_button[data-state=active]]:bg-transparent [&_button[data-state=active]]:shadow-none'
                            }
                        >
                            <TabsTrigger value={'quotes'}>Quotes</TabsTrigger>
                            <TabsTrigger value={'reasoning'}>
                                Reasoning
                            </TabsTrigger>
                            <TabsTrigger value={'tables'}>Tables</TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value={'quotes'}
                            className='h-full overflow-y-auto'
                        >
                            <div
                                className={
                                    'h-full overflow-y-auto p-2 pb-36 [&_ul]:list-disc [&_ul]:pl-5'
                                }
                            >
                                <Markdown>
                                    {
                                        currentPaper.supportingEvidence.benefits
                                            .quotes
                                    }
                                </Markdown>
                            </div>
                        </TabsContent>
                        <TabsContent
                            value={'reasoning'}
                            className='h-full overflow-y-auto'
                        >
                            <div
                                className={
                                    'h-full overflow-y-auto p-2 pb-36 [&_ul]:list-disc [&_ul]:pl-5'
                                }
                            >
                                <Markdown>
                                    {
                                        currentPaper.supportingEvidence.benefits
                                            .reasoning
                                    }
                                </Markdown>
                            </div>
                        </TabsContent>
                        <TabsContent
                            value={'tables'}
                            className='h-full overflow-y-auto'
                        >
                            <div
                                className={
                                    'h-full overflow-y-auto p-2 pb-36 [&_ul]:list-disc [&_ul]:pl-5'
                                }
                            >
                                <Markdown>
                                    {
                                        currentPaper.supportingEvidence.benefits
                                            .tables
                                    }
                                </Markdown>
                            </div>
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
            </ResizablePanelGroup>
            <div
                className={
                    'absolute left-1 bottom-1 flex gap-2 p-1 rounded-md backdrop-blur-md'
                }
            >
                <div className='flex items-center gap-1'>
                    {[1, 2, 3, 4, 5].map(rating => (
                        <button
                            key={rating}
                            className={`text-muted-foreground transition-colors hover:text-yellow-500 ${
                                currentRating && rating <= currentRating
                                    ? 'text-yellow-500'
                                    : ''
                            }`}
                            onClick={() =>
                                rateResearchDetail(
                                    currentPaper.filename,
                                    selectedField,
                                    rating
                                )
                            }
                        >
                            <Star
                                className='size-5'
                                fill={currentRating && rating <= currentRating ? 'currentColor' : 'none'}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
