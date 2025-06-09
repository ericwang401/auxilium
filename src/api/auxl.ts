import type { ReviewState } from '@/stores/review'
import { open, save } from '@tauri-apps/plugin-dialog'
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'

export async function openAuxlFile(): Promise<string | null> {
    try {
        const selected = await open({
            multiple: false,
            filters: [
                {
                    name: 'Auxl',
                    extensions: ['auxl'],
                },
            ],
        })

        if (selected) {
            const content = await readTextFile(selected)
            return content
        }
        return null
    } catch (error) {
        throw new Error(
            `Failed to open auxl file: ${error instanceof Error ? error.message : String(error)}`
        )
    }
}

export async function saveAuxlFile(
    content: string,
    defaultPath?: string
): Promise<string | null> {
    try {
        const path = await save({
            filters: [
                {
                    name: 'Auxl',
                    extensions: ['auxl'],
                },
            ],
            defaultPath,
        })

        if (path) {
            await writeTextFile(path, content)
            return path
        }
        return null
    } catch (error) {
        throw new Error(
            `Failed to save auxl file: ${error instanceof Error ? error.message : String(error)}`
        )
    }
}

export function serializeReviewState(state: ReviewState): string {
    return JSON.stringify({
        papers: state.papers,
        ratings: state.ratings,
        currentPaper: state.currentPaper,
        currentPaperNumber: state.currentPaperNumber,
        totalPapers: state.totalPapers,
        canGoToNext: state.canGoToNext,
        canGoToPrevious: state.canGoToPrevious,
    })
}

export function deserializeReviewState(json: string): Partial<ReviewState> {
    return JSON.parse(json)
}
