/**
 * Create mobile status history enrty after status update
 */
 export default function MobileStatusHistoryEntryCreate(context, properties, readLink) {
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusHistoryUpdate.action', 
        'Properties': {
            'Properties': properties,
            'Target':
            {
                'EntitySet': 'PMMobileStatusHistories',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
            'CreateLinks':
                [{
                    'Property': 'PMMobileStatus_Nav',
                    'Target':
                    {
                        'EntitySet': 'PMMobileStatuses',
                        'ReadLink': readLink,
                    },
                }],
        },
    });
}
