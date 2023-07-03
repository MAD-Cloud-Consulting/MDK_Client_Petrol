/**
* Function to fix the queue of UD posted to backend
* Must post all RR before any UD
* @param {context} context
*/
export default function InspectionLotSetUsageDecisionNav(context) {
    let array = [];
    let original_binding = context.binding['@odata.readLink'];
    //Count local UsageDecisions
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'InspectionLots', [], '$filter=sap.islocal()&$expand=InspectionCode_Nav,InspValuation_Nav').then(function(result) {
        if (result.length > 0) {
            //delete all local UD and remake them
            for (var k = 0; k < result.length; k++) {
                //store local ud 
                let localUD = result.getItem(k);
                array.push((function(localObject) {
                    //delete local ud
                    return context.executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericDiscard.action', 'Properties': {
                        'Target': {
                            'EntitySet': 'InspectionLots',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'EditLink': localObject['@odata.editLink'],
                        },
                    }}).then(()=> {
                    //re-create stored local ud
                        return context.executeAction({'Name': '/SAPAssetManager/Actions/WorkOrders/InspectionLot/InspectionLotSetUsage.action', 'Properties': {
                            'Target': {
                                'EntitySet' : 'InspectionLots',
                                'Service' : '/SAPAssetManager/Services/AssetManager.service',
                                'ReadLink': localObject['@odata.readLink'],
                            },
                            'Properties': {
                                'UDCatalog': localObject.UDCatalog,
                                'UDCode': localObject.UDCode,
                                'UDCodeGroup': localObject.UDCodeGroup,
                                'UDSelectedSet': localObject.UDSelectedSet,
                                'Plant': localObject.Plant,
                            },
                            'Headers': {
                                'OfflineOData.TransactionID': localObject.OrderId,
                            },
                            'UpdateLinks': [
                                {
                                    'Property': 'InspValuation_Nav',
                                    'Target': {
                                        'EntitySet': 'InspectionCatalogValuations',
                                        'ReadLink': localObject.InspValuation_Nav ? localObject.InspValuation_Nav['@odata.readLink']: '',
                                    },
                                },
                                {
                                    'Property': 'InspectionCode_Nav',
                                    'Target': {
                                        'EntitySet': 'InspectionCodes',
                                        'ReadLink': localObject.InspectionCode_Nav ? localObject.InspectionCode_Nav['@odata.readLink'] : '',
                                    },
                                },
                            ],
                            'OnSuccess': '',
                        }});
                    });
                })(localUD));
            }
            return Promise.all(array).then(()=> {
                //continue with UD creation
                return context.read('/SAPAssetManager/Services/AssetManager.service', original_binding, [], '').then(value=> {
                    context.setActionBinding(value.getItem(0));
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/InspectionLot/InspectionLotSetUsageRequiredFields.action');
                }); 
            });
        } else { //no local UD
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/InspectionLot/InspectionLotSetUsageRequiredFields.action');
        }
    });
}
