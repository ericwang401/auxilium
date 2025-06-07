import useSelectedFileStore from '@/stores/selected-file-store.ts'
import { UnlistenFn } from '@tauri-apps/api/event'
import { getCurrentWebview } from '@tauri-apps/api/webview'
import pathParser from 'path-browserify'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils.ts'

const DropOverlay = () => {
    const { setSelectedPath } = useSelectedFileStore()

    const [isDragging, setIsDragging] = useState(false)
    const unlisten = useRef<UnlistenFn>()

    useEffect(() => {
        const main = async () => {
            unlisten.current = await getCurrentWebview().onDragDropEvent(
                event => {
                    if (event.payload.type === 'over') {
                        setIsDragging(true)
                    } else if (event.payload.type === 'drop') {
                        setIsDragging(false)
                        const filePath = event.payload.paths[0]
                        if (pathParser.extname(filePath) === '.csv') {
                            setSelectedPath(filePath)
                        }
                    } else {
                        setIsDragging(false)
                    }
                }
            )
        }

        main()

        return () => {
            unlisten.current?.()
        }
    }, [])

    return (
        <div
            className={cn(
                'bg-secondary pointer-events-none fixed top-0 left-0 z-[999999999999] flex h-full w-full flex-col items-center justify-center transition',
                isDragging ? 'opacity-75' : 'opacity-0'
            )}
        >
            <div className='border-primary absolute inset-10 border-2 border-dashed' />
            {/*<div className='relative h-20 w-20'>*/}
            {/*    {true && (*/}
            {/*        <>*/}
            {/*            <File*/}
            {/*                className={cn(*/}
            {/*                    'text-foreground absolute z-[3] h-20 w-20 fill-white',*/}
            {/*                    styles.dropzoneAnimatedIcon*/}
            {/*                )}*/}
            {/*                style={{ '--offset': '1rem' }}*/}
            {/*            />*/}
            {/*            <File*/}
            {/*                className={cn(*/}
            {/*                    'text-foreground absolute z-[2] h-20 w-20 fill-white',*/}
            {/*                    styles.dropzoneAnimatedIcon*/}
            {/*                )}*/}
            {/*            />*/}
            {/*            <File*/}
            {/*                className={cn(*/}
            {/*                    'text-foreground absolute z-[1] h-20 w-20 fill-white',*/}
            {/*                    styles.dropzoneAnimatedIcon*/}
            {/*                )}*/}
            {/*                style={{ '--offset': '-1rem' }}*/}
            {/*            />*/}
            {/*        </>*/}
            {/*    )}*/}
            {/*</div>*/}
            <h3 className='text-primary mt-4 font-medium'>
                Release to import spreadsheet
            </h3>
        </div>
    )
}

export default DropOverlay
