import libCom from '../../../Common/Library/CommonLibrary';

export default function InspectionPointReviewCharacteristics(context) {
    return libCom.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/WorkOrders/Operations/InspectionPoints/InspectionPointReviewCharacteristics.action', context.binding['@odata.readLink'], '$expand=InspectionChar_Nav');
}
