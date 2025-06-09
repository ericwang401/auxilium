import type { ParsedSpreadsheet } from '@/types/spreadsheet'
import { invoke } from '@tauri-apps/api/core'

/**
 * Parse a CSV spreadsheet file and return structured research data
 * @param filePath - Absolute path to the CSV file
 * @returns Promise containing parsed spreadsheet data
 */
export async function parseSpreadsheet(
    filePath: string
): Promise<ParsedSpreadsheet> {
    try {
        return await invoke<ParsedSpreadsheet>('parse_spreadsheet', {
            filePath,
        })
    } catch (error) {
        throw new Error(
            `Failed to parse spreadsheet: ${error instanceof Error ? error.message : String(error)}`
        )
    }
}

export const exportReviewData = async (data: { filename: string; ratings: Record<string, number> }[]) => {
    await invoke('export_reviews', { reviews: data })
}
