import { useEffect } from 'react'
import {
    isPermissionGranted,
    requestPermission,
} from '@tauri-apps/plugin-notification'
import { showNotification } from '@/utils/notification'

const NotificationPermission = () => {
    useEffect(() => {
        const checkPermission = async () => {
            let permissionGranted = await isPermissionGranted()
            if (!permissionGranted) {
                const permission = await requestPermission()
                permissionGranted = permission === 'granted'
                if (permissionGranted) {
                    await showNotification(
                        'Notifications Enabled',
                        'You will now receive notifications from Auxilium'
                    )
                }
            }
        }
        checkPermission()
    }, [])

    return null
}

export default NotificationPermission