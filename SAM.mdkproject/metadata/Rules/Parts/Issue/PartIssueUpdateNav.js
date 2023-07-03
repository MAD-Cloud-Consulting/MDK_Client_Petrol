import libCommon from '../../Common/Library/CommonLibrary';
import libPart from '../PartLibrary';

const queryOption = '$select=MaterialDocNumber,GMCode,RelatedItem/EntryQuantity,RelatedItem/EntryUOM,RelatedItem/Material,RelatedItem/MaterialDocYear,RelatedItem/MovementType,RelatedItem/OrderNumber,RelatedItem/Plant,RelatedItem/ReservationItemNumber,RelatedItem/ReservationNumber,RelatedItem/StorageLocation,RelatedItem/MatDocItem&$expand=RelatedItem';

export default function PartIssueUpdateNav(context) {
    libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.getBindingObject()['@odata.readLink'], [],queryOption).then(results => {
        if (results.getItem(0)) {
            return libPart.IsSerialPart(context,results.getItem(0).RelatedItem[0].Material).then(result => {
                if (result) {
                    return context.executeAction('/SAPAssetManager/Actions/ErrorArchive/ErrorArchiveUnkownEntity.action');
                }                else {
                    return libCommon.navigateOnRead(context, '/SAPAssetManager/Actions/Parts/PartIssueUpdateNav.action', context.getBindingObject()['@odata.readLink'], queryOption);
                }
            });
        } else {
            return context.executeAction('/SAPAssetManager/Actions/ErrorArchive/ErrorArchiveUnkownEntity.action');
        }
    });
}
