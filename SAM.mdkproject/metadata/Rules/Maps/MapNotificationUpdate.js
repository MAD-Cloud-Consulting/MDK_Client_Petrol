
export default function MapNotificationUpdate(context) {
    var extension = context.getControl('MapExtensionControl')._control;
    if (extension) {
        const json = {
            EditModeConfig: {
                ObjectKey: context.binding.NotificationNumber,
                EditModePanel: {
                    GeometryTypes: ['Point', 'Polyline', 'Polygon'],
                    TitleText: 'action_update_notif',
                    SaveButtonText: 'save',
                    Symbol: {
                        marker : 'MarkerNotification',
                        styleWidth : 24,
                        styleHeight : 24,
                        lineColor : '04ACA7',
                        fillColor : '04ACA733',
                        lineWidth : 2,
                        yOffset : 0,
                        xOffset : 0,
                    },
                },
                CallbackInfo: {
                    Action: '/SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateGeometryPre.js',
                    Target: {
                        EntitySet: 'MyNotificationHeaders',
                        Service: '/SAPAssetManager/Services/AssetManager.service',
                        Properties: [],
                        KeyProperties: [],
                    },
                },
            },
        };
        extension.enterEditMode(json);
    }
}
