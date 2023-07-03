import common from '../../Rules/Common/Library/CommonLibrary';

export default function InspectionCharacteristicsDetailsNav(context) {
    common.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/InspectionCharacteristics/InspectionCharacteristicsDetails.action', `${context.binding['@odata.readLink']}`, '$expand=MasterInspChar_Nav,NotifItems_Nav,InspectionMethod_Nav,InspectionMethod_Nav/MethodDoc_Nav,InspectionMethod_Nav/MethodDoc_Nav/Document_Nav,InspectionMethod_Nav/MethodLongText_Nav');
}
