import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification'

export async function showNotification(title: string, body: string) {
    let permissionGranted = await isPermissionGranted()
    if (!permissionGranted) {
        const permission = await requestPermission()
        permissionGranted = permission === 'granted'
    }

    if (permissionGranted) {
        await sendNotification({
            title,
            body,
            icon: 'icons/icon.png',
        })
    }
}