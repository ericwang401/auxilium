import { create } from 'zustand/react'
import type { Paper } from '@/types/spreadsheet'

export type ReviewStatus = 'pending' | 'correct' | 'incorrect'

// Evidence set reviews removed - just viewing the evidence, not reviewing it

export interface ResearchDetailReviews {
    researchGoal: ReviewStatus
    targetCondition: ReviewStatus
    hasSensorDevice: ReviewStatus
    deviceType: ReviewStatus
    category: ReviewStatus
    sensorType: ReviewStatus
    method: ReviewStatus
    placement: ReviewStatus
    measurementVariable: ReviewStatus
    benefits: ReviewStatus
    primaryPurpose: ReviewStatus
    performanceMetrics: ReviewStatus
    deviceLimitation: ReviewStatus
    measurementUnit: ReviewStatus
    measurementPrecision: ReviewStatus
}

export interface RecordReview {
    recordId: string // Using filename or a combination of title + doi as unique ID
    reviews: ResearchDetailReviews
    overallStatus: ReviewStatus
    notes?: string
    lastReviewedAt?: Date
}

interface ResearchReviewState {
    // Current loaded records
    records: Paper[]
    totalCount: number
    isLoading: boolean
    error: string | null

    // Review state for each record
    recordReviews: Record<string, RecordReview>

    // Current record being reviewed
    currentRecordIndex: number

    // Actions
    setRecords: (records: Paper[], totalCount: number) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void

    // Review actions
    setDetailReview: (recordId: string, field: keyof ResearchDetailReviews, status: ReviewStatus) => void
    setOverallReview: (recordId: string, status: ReviewStatus, notes?: string) => void
    addNotes: (recordId: string, notes: string) => void

    // Navigation
    setCurrentRecord: (index: number) => void
    nextRecord: () => void
    previousRecord: () => void

    // Utility getters
    getCurrentRecord: () => Paper | null
    getCurrentRecordReview: () => RecordReview | null
    getReviewProgress: () => { reviewed: number; total: number; percentage: number }
    getRecordId: (record: Paper) => string

    // Reset
    reset: () => void
}

const createDefaultReviews = (): ResearchDetailReviews => ({
    researchGoal: 'pending',
    targetCondition: 'pending',
    hasSensorDevice: 'pending',
    deviceType: 'pending',
    category: 'pending',
    sensorType: 'pending',
    method: 'pending',
    placement: 'pending',
    measurementVariable: 'pending',
    benefits: 'pending',
    primaryPurpose: 'pending',
    performanceMetrics: 'pending',
    deviceLimitation: 'pending',
    measurementUnit: 'pending',
    measurementPrecision: 'pending',
})

const useResearchReviewStore = create<ResearchReviewState>((set, get) => ({
    // Initial state
    records: [],
    totalCount: 0,
    isLoading: false,
    error: null,
    recordReviews: {},
    currentRecordIndex: 0,

    // Actions
    setRecords: (records, totalCount) => {
        const recordReviews: Record<string, RecordReview> = {}

        // Initialize review state for each record
        records.forEach(record => {
            const recordId = get().getRecordId(record)
            recordReviews[recordId] = {
                recordId,
                reviews: createDefaultReviews(),
                overallStatus: 'pending',
                lastReviewedAt: new Date(),
            }
        })

        set({
            records,
            totalCount,
            recordReviews,
            currentRecordIndex: 0,
            error: null,
        })
    },

    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // Review actions
    setDetailReview: (recordId, field, status) => {
        const { recordReviews } = get()
        const currentReview = recordReviews[recordId]

        if (!currentReview) return

        const updatedReviews = {
            ...currentReview.reviews,
            [field]: status,
        }

        // Auto-update overall status based on detail reviews
        const reviewValues = Object.values(updatedReviews)
        let overallStatus: ReviewStatus = 'pending'

        if (reviewValues.every(status => status === 'correct')) {
            overallStatus = 'correct'
        } else if (reviewValues.some(status => status === 'incorrect')) {
            overallStatus = 'incorrect'
        } else if (reviewValues.every(status => status !== 'pending')) {
            // Mix of correct/incorrect but no pending
            overallStatus = 'incorrect'
        }

        set({
            recordReviews: {
                ...recordReviews,
                [recordId]: {
                    ...currentReview,
                    reviews: updatedReviews,
                    overallStatus,
                    lastReviewedAt: new Date(),
                },
            },
        })
    },

    setOverallReview: (recordId, status, notes) => {
        const { recordReviews } = get()
        const currentReview = recordReviews[recordId]

        if (!currentReview) return

        set({
            recordReviews: {
                ...recordReviews,
                [recordId]: {
                    ...currentReview,
                    overallStatus: status,
                    notes,
                    lastReviewedAt: new Date(),
                },
            },
        })
    },

    addNotes: (recordId, notes) => {
        const { recordReviews } = get()
        const currentReview = recordReviews[recordId]

        if (!currentReview) return

        set({
            recordReviews: {
                ...recordReviews,
                [recordId]: {
                    ...currentReview,
                    notes,
                    lastReviewedAt: new Date(),
                },
            },
        })
    },

    // Navigation
    setCurrentRecord: (index) => {
        const { records } = get()
        if (index >= 0 && index < records.length) {
            set({ currentRecordIndex: index })
        }
    },

    nextRecord: () => {
        const { currentRecordIndex, records } = get()
        if (currentRecordIndex < records.length - 1) {
            set({ currentRecordIndex: currentRecordIndex + 1 })
        }
    },

    previousRecord: () => {
        const { currentRecordIndex } = get()
        if (currentRecordIndex > 0) {
            set({ currentRecordIndex: currentRecordIndex - 1 })
        }
    },

    // Utility getters
    getCurrentRecord: () => {
        const { records, currentRecordIndex } = get()
        return records[currentRecordIndex] || null
    },

    getCurrentRecordReview: () => {
        const { recordReviews } = get()
        const currentRecord = get().getCurrentRecord()
        if (!currentRecord) return null

        const recordId = get().getRecordId(currentRecord)
        return recordReviews[recordId] || null
    },

    getReviewProgress: () => {
        const { recordReviews, totalCount } = get()
        const reviewed = Object.values(recordReviews).filter(
            review => review.overallStatus !== 'pending'
        ).length

        return {
            reviewed,
            total: totalCount,
            percentage: totalCount > 0 ? (reviewed / totalCount) * 100 : 0,
        }
    },

    getRecordId: (record) => {
        // Create a unique ID from filename, or fallback to title + doi
        return record.filename || `${record.title}_${record.doi}`.replace(/[^a-zA-Z0-9]/g, '_')
    },

    // Reset
    reset: () => set({
        records: [],
        totalCount: 0,
        isLoading: false,
        error: null,
        recordReviews: {},
        currentRecordIndex: 0,
    }),
}))

export default useResearchReviewStore
