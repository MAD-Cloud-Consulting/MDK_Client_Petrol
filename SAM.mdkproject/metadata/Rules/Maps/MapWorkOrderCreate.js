import WorkOrderAddTextButton from '../Common/ChangeSet/WorkOrderAddTextButton';

export default function MapWorkOrderCreate(context) {
    var extension = context.getControl('MapExtensionControl')._control;
    if (extension) {
        const json = {
            EditModeConfig: {
                EditModePanel: {
                    GeometryTypes: ['Point', 'Polyline', 'Polygon'],
                    TitleText: 'action_create_workorder',
                    SaveButtonText: WorkOrderAddTextButton(context),
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
                    Action: '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/WorkOrderCreateFromMap.js',
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
