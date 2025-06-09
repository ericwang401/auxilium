import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/ui/menubar'
import { open } from '@tauri-apps/plugin-dialog'
import { parseSpreadsheet } from '@/api/spreadsheet'
import { useReviewStore } from '@/stores/review'
import { showNotification } from '@/utils/notification'
import { useNavigate } from '@tanstack/react-router'

const Toolbar = () => {
    const navigate = useNavigate()
    const { loadSpreadsheet } = useReviewStore()

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

    return (
        <Menubar className='rounded-none border-none shadow-none'>
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onClick={handleOpenSpreadsheet}>
                        Open spreadsheet
                    </MenubarItem>
                    <MenubarItem>
                        Export spreadsheet
                    </MenubarItem>
                    <MenubarItem>
                        Open auxl
                    </MenubarItem>
                    <MenubarItem>
                        Save auxl
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
