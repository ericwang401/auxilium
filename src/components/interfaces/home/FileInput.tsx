import useSelectedFileStore from '@/stores/selected-file-store.ts'
import useResearchReviewStore from '@/stores/research-review-store.ts'
import { parseSpreadsheet } from '@/api/spreadsheet'
import { useNavigate } from '@tanstack/react-router'
import { open } from '@tauri-apps/plugin-dialog'
import pathParser from 'path-browserify'
import { useState } from 'react'

import { Button } from '@/components/ui/button.tsx'

const FileInput = () => {
    const { selectedPath, setSelectedPath } = useSelectedFileStore()
    const { setRecords, setLoading, setError, isLoading } = useResearchReviewStore()
    const navigate = useNavigate()
    const [loadError, setLoadError] = useState<string | null>(null)

    const select = async () => {
        const file = await open({
            multiple: false,
            directory: false,
            filters: [
                {
                    name: 'CSV files',
                    extensions: ['csv'],
                },
            ],
        })

        if (file) {
            setSelectedPath(file)
            setLoadError(null) // Clear any previous errors when selecting a new file
        }
    }

    const handleLoadSpreadsheet = async () => {
        if (!selectedPath) return

        try {
            setLoading(true)
            setLoadError(null)
            setError(null)

            console.log('Loading spreadsheet from:', selectedPath)
            const result = await parseSpreadsheet(selectedPath)

            console.log('Spreadsheet parsed successfully:', {
                totalRecords: result.totalCount,
                firstRecord: result.records[0]?.title
            })

            setRecords(result.records, result.totalCount)

            // Navigate to review page (we'll need to create this route)
            navigate({ to: '/review' })
        } catch (error) {
            console.error('Failed to load spreadsheet:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            setLoadError(errorMessage)
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className={
                'flex h-full w-full flex-col items-center justify-center gap-4'
            }
        >
            <h3 className='text-primary mt-4 font-medium'>
                {selectedPath
                    ? `Selected spreadsheet: ${pathParser.parse(selectedPath).base}`
                    : 'No spreadsheet selected. (You can drag and drop)'}
            </h3>

            {(loadError || isLoading) && (
                <div className='max-w-md text-center'>
                    {isLoading && (
                        <p className='text-sm text-muted-foreground'>
                            Loading and parsing spreadsheet...
                        </p>
                    )}
                    {loadError && (
                        <p className='text-sm text-destructive'>
                            Error: {loadError}
                        </p>
                    )}
                </div>
            )}

            <div className={'flex gap-3'}>
                <Button onClick={select} disabled={isLoading}>
                    Select file
                </Button>
                <Button
                    variant={'outline'}
                    disabled={selectedPath === null || isLoading}
                    onClick={handleLoadSpreadsheet}
                >
                    {isLoading ? 'Loading...' : 'Go'}
                </Button>
            </div>
        </div>
    )
}

export default FileInput
