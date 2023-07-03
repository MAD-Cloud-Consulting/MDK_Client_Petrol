import libCommon from '../Common/Library/CommonLibrary';

export default function ObjectSortNumber(clientAPI, navlink, fieldname) {
    var max = 0;
    var readLink = null;
    if (clientAPI.binding) // binding may be undefined due to side bar
        readLink = clientAPI.binding['@odata.readLink'];
    if (libCommon.isDefined(readLink) && (clientAPI.binding['@odata.type'] === '#sap_mobile.MyNotificationHeader' || 
                    clientAPI.binding['@odata.type'] === '#sap_mobile.MyNotificationItems')) {
        return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', readLink + '/' + navlink, [], '').then( function(data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    let item = data.getItem(i);
                    let sortNum = parseInt(item[fieldname]);

                    if (!Number.isNaN(sortNum)) {
                        if (sortNum > max) {
                            max = sortNum;
                        }
                    }
                }
            }
            return String(max + 1).padStart(4, '0');
        });
   } else {
     return '0001';
   }

}
