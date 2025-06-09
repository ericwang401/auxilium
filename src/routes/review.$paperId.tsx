import { useReviewStore } from '@/stores/review'
import type { ResearchRecordField } from '@/types/spreadsheet'
import { createFileRoute } from '@tanstack/react-router'
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
})

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
    } = useReviewStore()

    const [selectedField, setSelectedField] =
        useState<ResearchRecordField>('researchGoal')

    // Get the paperId from the route params
    const { paperId } = useParams({ from: '/review/$paperId' })

    // Set the current paper when the route changes
    useEffect(() => {
        if (paperId) {
            setCurrentPaper(paperId)
        }
    }, [paperId, setCurrentPaper])

    if (!currentPaper) {
        return <div>No paper selected</div>
    }

    const currentRating = getResearchDetailRating(
        currentPaper.filename,
        selectedField
    )

    return (
        <div className='flex flex-col h-full'>
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
                            'flex items-center justify-end gap-1.5 text-sm'
                        }
                    >
                        <dd>4</dd>
                        <dt aria-label={'Number of approved research details'}>
                            <Check className={'size-4'} />
                        </dt>
                        <dd className={'ml-2'}>5</dd>
                        <dt aria-label={'Number of rejected research details'}>
                            <Ban className={'size-4'} />
                        </dt>
                        <dd className={'ml-2'}>2</dd>
                        <dt
                            aria-label={'Number of unreviewed research details'}
                        >
                            <Hourglass className={'size-4'} />
                        </dt>
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
                            <SelectItem value='researchGoal'>
                                Research Goal
                            </SelectItem>
                            <SelectItem value='targetCondition'>
                                Target Condition
                            </SelectItem>
                            <SelectItem value='hasSensorDevice'>
                                Has Sensor Device
                            </SelectItem>
                            <SelectItem value='deviceType'>
                                Device Type
                            </SelectItem>
                            <SelectItem value='category'>Category</SelectItem>
                            <SelectItem value='sensorType'>
                                Sensor Type
                            </SelectItem>
                            <SelectItem value='method'>Method</SelectItem>
                            <SelectItem value='placement'>Placement</SelectItem>
                            <SelectItem value='measurementVariable'>
                                Measurement Variable
                            </SelectItem>
                            <SelectItem value='benefits'>Benefits</SelectItem>
                            <SelectItem value='primaryPurpose'>
                                Primary Purpose
                            </SelectItem>
                            <SelectItem value='performanceMetrics'>
                                Performance Metrics
                            </SelectItem>
                            <SelectItem value='deviceLimitation'>
                                Device Limitation
                            </SelectItem>
                            <SelectItem value='measurementUnit'>
                                Measurement Unit
                            </SelectItem>
                            <SelectItem value='measurementPrecision'>
                                Measurement Precision
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
                    <Tabs defaultValue={'quotes'} className='h-full'>
                        <TabsList
                            className={
                                '[&_button[data-state=active]]:border-foreground bg-transparent [&_button[data-state=active]]:border [&_button[data-state=active]]:bg-transparent [&_button[data-state=active]]:shadow-none'
                            }
                        >
                            <TabsTrigger value={'quotes'}>Quotes</TabsTrigger>
                            <TabsTrigger value={'tables'}>Tables</TabsTrigger>
                            <TabsTrigger value={'reasoning'}>
                                Reasoning
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value={'quotes'} className='h-full overflow-y-auto'>
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
                        <TabsContent value={'tables'} className='h-full overflow-y-auto'>
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
                        <TabsContent value={'reasoning'} className='h-full overflow-y-auto'>
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
                    </Tabs>
                </ResizablePanel>
            </ResizablePanelGroup>
            <div className={'absolute right-3 bottom-1 flex gap-2 p-1 rounded-md backdrop-blur-md'}>
                <div className='flex items-center gap-1'>
                    {[1, 2, 3, 4, 5].map(rating => (
                        <button
                            key={rating}
                            className={`text-muted-foreground transition-colors hover:text-yellow-500 ${
                                currentRating === rating
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
                            <Star className='size-5' />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
