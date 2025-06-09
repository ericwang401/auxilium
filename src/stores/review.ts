import { create } from 'zustand'
import type { ResearchRecord, ResearchRecordField } from '@/types/spreadsheet'

interface ResearchDetailRating {
    rating: number
    timestamp: number
}

interface ReviewState {
    papers: ResearchRecord[]
    currentPaper: ResearchRecord | null
    ratings: Record<string, Record<ResearchRecordField, ResearchDetailRating | null>>
    loadSpreadsheet: (papers: ResearchRecord[]) => void
    setCurrentPaper: (filename: string) => void
    rateResearchDetail: (filename: string, field: ResearchRecordField, rating: number) => void
    getResearchDetailRating: (filename: string, field: ResearchRecordField) => number | null
    currentPaperNumber: number
    totalPapers: number
    canGoToNext: boolean
    canGoToPrevious: boolean
    setCurrentPaperIndex: (index: number) => void
}

export const useReviewStore = create<ReviewState>((set, get) => ({
    papers: [],
    currentPaper: null,
    ratings: {},
    currentPaperNumber: 0,
    totalPapers: 0,
    canGoToNext: false,
    canGoToPrevious: false,
    loadSpreadsheet: (papers) => {
        const ratings: Record<string, Record<ResearchRecordField, ResearchDetailRating | null>> = {}
        papers.forEach((paper) => {
            ratings[paper.filename] = {
                title: null,
                authors: null,
                doi: null,
                doiLink: null,
                venue: null,
                citationCount: null,
                year: null,
                filename: null,
                researchGoal: null,
                targetCondition: null,
                hasSensorDevice: null,
                deviceType: null,
                category: null,
                sensorType: null,
                method: null,
                placement: null,
                measurementVariable: null,
                benefits: null,
                primaryPurpose: null,
                performanceMetrics: null,
                deviceLimitation: null,
                measurementUnit: null,
                measurementPrecision: null,
            }
        })
        set({
            papers,
            ratings,
            totalPapers: papers.length,
            currentPaperNumber: 0,
            canGoToNext: papers.length > 1,
            canGoToPrevious: false
        })
    },
    setCurrentPaper: (filename) => {
        const { papers } = get()
        const paper = papers.find((p) => p.filename === filename)
        if (paper) {
            const index = papers.findIndex((p) => p.filename === filename)
            set({
                currentPaper: paper,
                currentPaperNumber: index + 1,
                canGoToNext: index < papers.length - 1,
                canGoToPrevious: index > 0
            })
        }
    },
    setCurrentPaperIndex: (index) => {
        const { papers } = get()
        if (index >= 0 && index < papers.length) {
            set({
                currentPaper: papers[index],
                currentPaperNumber: index + 1,
                canGoToNext: index < papers.length - 1,
                canGoToPrevious: index > 0
            })
        }
    },
    rateResearchDetail: (filename, field, rating) => {
        const { ratings } = get()
        set({
            ratings: {
                ...ratings,
                [filename]: {
                    ...ratings[filename],
                    [field]: {
                        rating,
                        timestamp: Date.now(),
                    },
                },
            },
        })
    },
    getResearchDetailRating: (filename, field) => {
        const { ratings } = get()
        return ratings[filename]?.[field]?.rating ?? null
    },
}))