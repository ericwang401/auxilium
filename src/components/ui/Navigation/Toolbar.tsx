import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/ui/menubar.tsx'





const Toolbar = () => {
    return (
        <Menubar className={'rounded-none border-none shadow-none'}>
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
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
        </Menubar>
    )
}

export default Toolbar
