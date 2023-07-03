import libCommon from '../../Common/Library/CommonLibrary';
import libPart from '../PartLibrary';

const queryOption = '$expand=RelatedItem';

export default function PartIssueFromRelatedItemUpdateNav(context) {
    libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.getBindingObject()['@odata.readLink'] + '/AssociatedMaterialDoc', [],queryOption).then(results => {
        if (results.getItem(0)) {
            return libPart.IsSerialPart(context,results.getItem(0).RelatedItem[0].Material).then(result => {
                if (result) {
                    return context.executeAction('/SAPAssetManager/Actions/ErrorArchive/ErrorArchiveUnkownEntity.action');
                }                else {
                    return libCommon.navigateOnRead(context, '/SAPAssetManager/Actions/Parts/PartIssueUpdateNav.action', context.getBindingObject()['@odata.readLink'] + '/AssociatedMaterialDoc', queryOption);
                }
            });
        } else {
            return context.executeAction('/SAPAssetManager/Actions/ErrorArchive/ErrorArchiveUnkownEntity.action');
        }
    });
}
