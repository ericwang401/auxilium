import { createFileRoute } from '@tanstack/react-router'
import {
    Ban,
    Check,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Hourglass,
} from 'lucide-react'
import Markdown from 'react-markdown'
import { z } from 'zod'

import { examplePaper } from '@/components/interfaces/home/AllTab.tsx'

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
    return (
        <>
            <div className={'flex shrink-0 gap-12 border-b px-3 py-2'}>
                <div className={'truncate'}>
                    <h3
                        className={
                            'truncate text-lg leading-relaxed font-medium'
                        }
                    >
                        {examplePaper.title}
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
                            {examplePaper.authors}
                        </span>{' '}
                        &middot; {examplePaper.venue} &middot; doi:{' '}
                        {examplePaper.doi}
                    </p>
                </div>
                <div className={'flex shrink-0 flex-col gap-1'}>
                    <div className={'flex gap-4'}>
                        <p className={'relative text-2xl font-medium'}>
                            <span>37</span>
                            <span
                                className={
                                    'mt-1 ml-1.5 inline-block align-top text-xs'
                                }
                            >
                                / 101
                            </span>
                        </p>
                        <div className={'flex gap-1'}>
                            <Button
                                variant={'outline'}
                                size={'icon'}
                                className={''}
                            >
                                <ChevronsLeft />{' '}
                                {/* this button goes to previous paper */}
                            </Button>
                            <Button
                                variant={'outline'}
                                size={'icon'}
                                className={''}
                            >
                                <ChevronLeft />{' '}
                                {/* this button goes to previous research detail to review */}
                            </Button>
                            <Button
                                variant={'outline'}
                                size={'icon'}
                                className={''}
                            >
                                <ChevronRight />{' '}
                                {/* this button goes to next paper */}
                            </Button>
                            <Button
                                variant={'outline'}
                                size={'icon'}
                                className={''}
                            >
                                <ChevronsRight />{' '}
                                {/* this button goes to next research detail to review */}
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
            <ResizablePanelGroup direction={'horizontal'}>
                <ResizablePanel>
                    <Select>
                        <SelectTrigger
                            className={
                                'focus-visible:border-input w-full rounded-none border-x-0 border-t-0 shadow-none focus-visible:ring-0'
                            }
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='researchGoal'>
                                Research Goal
                            </SelectItem>
                            <SelectItem value='targetCondition'>
                                Target condition
                            </SelectItem>
                            <SelectItem value='hasSensorDevice'>
                                sensor, device, imaging technique, or labratory
                                testing mentioned?
                            </SelectItem>
                            <SelectItem value='deviceType'>
                                Device / sensor / technique/ test/ inspection
                                type
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
                            <SelectItem value='benefits'>
                                Benefits of use
                            </SelectItem>
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
                            'h-full overflow-y-auto p-2 [&_ul]:list-disc [&_ul]:pl-5'
                        }
                    >
                        <Markdown>{examplePaper.benefits}</Markdown>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                    <Tabs defaultValue={'quotes'}>
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
                        <TabsContent value={'quotes'}>
                            <div
                                className={
                                    'h-full overflow-y-auto p-2 [&_ul]:list-disc [&_ul]:pl-5'
                                }
                            >
                                <Markdown>
                                    {
                                        examplePaper.supportingEvidence.benefits
                                            .quotes
                                    }
                                </Markdown>
                            </div>
                        </TabsContent>
                        <TabsContent value={'tables'}>
                            <div
                                className={
                                    'h-full overflow-y-auto p-2 [&_ul]:list-disc [&_ul]:pl-5'
                                }
                            >
                                <Markdown>
                                    {
                                        examplePaper.supportingEvidence.benefits
                                            .tables
                                    }
                                </Markdown>
                            </div>
                        </TabsContent>
                        <TabsContent value={'reasoning'}>
                            <div
                                className={
                                    'h-full overflow-y-auto p-2 [&_ul]:list-disc [&_ul]:pl-5'
                                }
                            >
                                <Markdown>
                                    {
                                        examplePaper.supportingEvidence.benefits
                                            .reasoning
                                    }
                                </Markdown>
                            </div>
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
            </ResizablePanelGroup>
            <div className={'absolute right-2 bottom-2 flex gap-2'}>
                <Button size={'sm'}>Approve</Button>
                <Button size={'sm'} variant={'destructive'}>
                    Reject
                </Button>
            </div>
        </>
    )
}
