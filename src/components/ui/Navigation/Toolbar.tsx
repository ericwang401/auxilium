import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/ui/menubar'
import { open } from '@tauri-apps/plugin-dialog'
import { parseSpreadsheet, exportReviewData } from '@/api/spreadsheet'
import { useReviewStore } from '@/stores/review'
import { showNotification } from '@/utils/notification'
import { useNavigate } from '@tanstack/react-router'

const Toolbar = () => {
    const navigate = useNavigate()
    const { loadSpreadsheet, papers, ratings } = useReviewStore()

    const handleOpenSpreadsheet = async () => {
        try {
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
                    <MenubarItem>
                        Open auxl
                    </MenubarItem>
                    <MenubarItem>
                        Save auxl
                    </MenubarItem>
                    <MenubarItem>
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
        </Menubar>
    )
}

export default Toolbar
