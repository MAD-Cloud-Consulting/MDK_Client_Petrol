
export default function MapWorkOrderUpdate(context) {
    var extension = context.getControl('MapExtensionControl')._control;
    if (extension) {
        const json = {
            EditModeConfig: {
                ObjectKey: context.binding.OrderId,
                EditModePanel: {
                    GeometryTypes: ['Point', 'Polyline', 'Polygon'],
                    TitleText: 'action_update_workorder',
                    SaveButtonText: 'save',
                    Symbol: {
                        marker : 'MarkerJob',
                        styleWidth : 24,
                        styleHeight : 24,
                        lineColor : '0070F2',
                        fillColor : '0070F233',
                        lineWidth : 2,
                        yOffset : 0,
                        xOffset : 0,
                    },
                },
                CallbackInfo: {
                    Action: '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/WorkOrderCreateUpdateGeometryPre.js',
                    Target: {
                        EntitySet: 'MyWorkOrderHeaders',
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

