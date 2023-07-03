import GetGeometryInformation from '../Common/GetGeometryInformation';
import NativeScriptObject from './Library/NativeScriptObject';

export default function FunctionalLocationLocationNavFormat(context) {
    let geometryPrefix = '';
    let navColor = '#0070F2';
    let nonNavColor = '#32363A';
    if (NativeScriptObject.getNativeScriptObject(context).applicationModule.systemAppearance()) {
        switch (NativeScriptObject.getNativeScriptObject(context).applicationModule.systemAppearance()) {
            case 'dark':
                navColor = '#0A84FF';
                nonNavColor = '#EBEBF5';
                break;
            case 'light':
                navColor = '#0070F2';
                nonNavColor = '#32363A';
                break;
            default:
                navColor ='#0070F2';
                nonNavColor = '#32363A';
                break;
        }
    }

    switch (context.getPageProxy().binding['@odata.type']) {
        case '#sap_mobile.MyWorkOrderHeader':
                geometryPrefix = 'WOGeometries';
            break;
        case '#sap_mobile.MyNotificationHeader':
                geometryPrefix = 'NotifGeometries';
            break;
        case '#sap_mobile.MyFunctionalLocation':
                geometryPrefix = 'FuncLocGeometries';
            break;
        case '#sap_mobile.MyEquipment':
                geometryPrefix = 'EquipGeometries';
            break;
        default:
            return nonNavColor;
    }
    let geometryItem = context.getPageProxy().getClientData().geometry;

    if (geometryItem && Object.keys(geometryItem).length > 0) {
        // geometryItem is valid and defined
        return nonNavColor;
    } else {
        // geometryItem is defined, but empty
        if (geometryItem) {
            if (geometryPrefix === 'WOGeometries' || geometryPrefix === 'NotifGeometries') {
                return context.read('/SAPAssetManager/Services/AssetManager.service', context.getPageProxy().binding['@odata.readLink'] + '/FunctionalLocation', [], '').then(function(result) {
                    if (result && result.getItem(0)) {
                        return navColor;
                    } else {
                        return nonNavColor;
                    }
                });
            } else {
                return nonNavColor;
            }
        } else {
            // geometryItem is invalid and needs to be read
            return GetGeometryInformation(context.getPageProxy(), geometryPrefix).then(function(value) {
                if (value && Object.keys(value).length > 0) {
                    // geometryItem is valid and defined
                    return navColor;
                } else {
                    return nonNavColor;
                }
            });
        }
    }
}
