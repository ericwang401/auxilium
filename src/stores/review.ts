import { create } from 'zustand'
import type { ResearchRecord, ResearchRecordField } from '@/types/spreadsheet'
import { openAuxlFile, saveAuxlFile, serializeReviewState, deserializeReviewState } from '@/api/auxl'
import { showNotification } from '@/utils/notification'
import { writeTextFile } from '@tauri-apps/plugin-fs'

interface ResearchDetailRating {
    rating: number
    timestamp: number
}

export interface ReviewState {
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
    currentFilePath: string | null
    hasUnsavedChanges: boolean
    openFile: () => Promise<void>
    saveFile: () => Promise<void>
    saveFileAs: () => Promise<void>
    markUnsaved: () => void
}

export const useReviewStore = create<ReviewState>((set, get) => ({
    papers: [],
    currentPaper: null,
    ratings: {},
    currentPaperNumber: 0,
    totalPapers: 0,
    canGoToNext: false,
    canGoToPrevious: false,
    currentFilePath: null,
    hasUnsavedChanges: false,
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
            canGoToPrevious: false,
            currentFilePath: null,
            hasUnsavedChanges: true
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
            hasUnsavedChanges: true
        })
    },
    getResearchDetailRating: (filename, field) => {
        const { ratings } = get()
        return ratings[filename]?.[field]?.rating ?? null
    },
    openFile: async () => {
        try {
            const content = await openAuxlFile()
            if (content) {
                const state = deserializeReviewState(content)
                set({
                    ...state,
                    currentFilePath: null, // Will be set after first save
                    hasUnsavedChanges: false
                })
                await showNotification('File Opened', 'Successfully loaded review data')
            }
        } catch (error) {
            console.error('Error opening file:', error)
            await showNotification(
                'Error',
                `Failed to open file: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    },
    saveFile: async () => {
        const { currentFilePath, hasUnsavedChanges } = get()
        if (!hasUnsavedChanges) return

        try {
            const content = serializeReviewState(get())
            if (!currentFilePath) {
                // If no current file path, treat it as "Save As"
                const path = await saveAuxlFile(content)
                if (path) {
                    set({
                        currentFilePath: path,
                        hasUnsavedChanges: false
                    })
                    await showNotification('File Saved', 'Successfully saved review data')
                }
            } else {
                // If we have a current file path, save directly to it
                await writeTextFile(currentFilePath, content)
                set({ hasUnsavedChanges: false })
                await showNotification('File Saved', 'Successfully saved review data')
            }
        } catch (error) {
            console.error('Error saving file:', error)
            await showNotification(
                'Error',
                `Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    },
    saveFileAs: async () => {
        try {
            const content = serializeReviewState(get())
            const path = await saveAuxlFile(content)
            if (path) {
                set({
                    currentFilePath: path,
                    hasUnsavedChanges: false
                })
                await showNotification('File Saved', 'Successfully saved review data')
            }
        } catch (error) {
            console.error('Error saving file:', error)
            await showNotification(
                'Error',
                `Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    },
    markUnsaved: () => {
        set({ hasUnsavedChanges: true })
    }
}))