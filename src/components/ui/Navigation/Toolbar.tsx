import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from '@/components/ui/menubar.tsx'

const Toolbar = () => {
    return (
        <Menubar className={'rounded-none border-x-0 border-t-0'}>
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
