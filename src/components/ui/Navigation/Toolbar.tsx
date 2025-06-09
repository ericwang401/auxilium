import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/ui/menubar'
import { confirm, message, open } from '@tauri-apps/plugin-dialog'
import { parseSpreadsheet, exportReviewData } from '@/api/spreadsheet'
import { useReviewStore } from '@/stores/review'
import { showNotification } from '@/utils/notification'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Window } from '@tauri-apps/api/window'
import { getVersion } from '@tauri-apps/api/app';
import { openUrl } from '@tauri-apps/plugin-opener';



const Toolbar = () => {
    const navigate = useNavigate()
    const {
        loadSpreadsheet,
        papers,
        ratings,
        openFile,
        saveFile,
        saveFileAs,
        hasUnsavedChanges
    } = useReviewStore()

    useEffect(() => {
        // Update window title to show unsaved changes
        Window.getCurrent().setTitle(`auxilium${hasUnsavedChanges ? ' *' : ''}`)

        // Add keyboard shortcuts
        const handleKeyDown = async (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault()
                if (e.shiftKey) {
                    await saveFileAs()
                } else {
                    await saveFile()
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [hasUnsavedChanges])

    // Add beforeunload handler
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault()
                e.returnValue = ''
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [hasUnsavedChanges])

    const handleOpenSpreadsheet = async () => {
        try {
            if (papers.length > 0) {
                const shouldContinue = await confirm('Are you sure you want to open a new spreadsheet? This will discard all your unsaved changes.')
                if (!shouldContinue) {
                    return
                }
            }

            const selected = await open({
                multiple: false,
                filters: [
                    {
                        name: 'CSV',
                        extensions: ['csv'],
                    },
                ],
            })

            if (selected) {
                const data = await parseSpreadsheet(selected)
                loadSpreadsheet(data.records)
                await showNotification(
                    'Spreadsheet Loaded',
                    `Successfully loaded ${data.records.length} papers`
                )
            }
        } catch (error) {
            console.error('Error loading spreadsheet:', error)
            await showNotification(
                'Error',
                `Failed to load spreadsheet: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    const handleExportSpreadsheet = async () => {
        try {
            const exportData = papers.map(paper => ({
                filename: paper.filename,
                ratings: Object.fromEntries(
                    Object.entries(ratings[paper.filename] || {})
                        .filter(([_, value]) => value !== null)
                        .map(([key, value]) => [key, (value?.rating || 0) * 2])
                )
            }))

            await exportReviewData(exportData)
            await showNotification(
                'Export Successful',
                'Review data has been exported successfully'
            )
        } catch (error) {
            console.error('Error exporting spreadsheet:', error)
            await showNotification(
                'Error',
                `Failed to export spreadsheet: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    const showAbout = async () => {
        const version = await getVersion()
        message(`Auxilium is a tool for reviewing research papers (a overkill app for a very specific use case and very specific data format! lol)\n\nVersion: ${version}\n\nAuthor: Eric Wang`)
    }

    return (
        <Menubar className='rounded-none border-none shadow-none'>
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onClick={handleOpenSpreadsheet}>
                        Open spreadsheet
                    </MenubarItem>
                    <MenubarItem onClick={handleExportSpreadsheet}>
                        Export spreadsheet
                    </MenubarItem>
                    <MenubarItem onClick={openFile}>
                        Open auxl
                    </MenubarItem>
                    <MenubarItem onClick={saveFile}>
                        Save auxl
                    </MenubarItem>
                    <MenubarItem onClick={saveFileAs}>
                        Save auxl as
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Navigate</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onClick={() => navigate({ to: '/' })}>
                        Home
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Help</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onClick={showAbout}>
                        About
                    </MenubarItem>
                    <MenubarItem onClick={() => openUrl('https://github.com/ericwang401/auxilium')}>
                        Source code
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}

export default Toolbar
