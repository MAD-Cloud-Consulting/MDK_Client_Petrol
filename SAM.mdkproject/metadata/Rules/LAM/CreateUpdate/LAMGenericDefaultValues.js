import libCommon from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';

/**
 * Set the client data default values for a new LAM record that is being copied from a default OData row
 * @param {*} context 
 */
export default function LAMGenericDefaultValues(context) {
    let type = libCommon.getStateVariable(context, 'LAMCreateType');
    let lamObj = libCommon.getStateVariable(context, 'LAMDefaultRow');
    let binding = context.getBindingObject();
    
    //Type specific navlink properties and key
    if (type === 'Operation') {
        binding.TempLAMObjectType = 'OV';
        binding.TempLAMReadLinkProperty = 'MyWorkOrderOperation_Nav';
        binding.TempLAMReadLinkEntitySet = 'MyWorkOrderOperations';
    } else if (type === 'WorkOrder') {
        binding.TempLAMObjectType = 'OR';
        binding.TempLAMReadLinkProperty = 'MyWorkOrderHeader_Nav';
        binding.TempLAMReadLinkEntitySet = 'MyWorkOrderHeaders';
    } else if (type === 'Notification') {
        binding.TempLAMObjectType = 'QM';
        binding.TempLAMReadLinkProperty = 'MyNotificationHeader_Nav';
        binding.TempLAMReadLinkEntitySet = 'MyNotificationHeaders';
    } else if (type === 'NotificationItem') {
        binding.TempLAMObjectType = 'QN';
        binding.TempLAMReadLinkProperty = 'MyNotificationItem_Nav';
        binding.TempLAMReadLinkEntitySet = 'MyNotificationItems';
    }
    binding.TempLAMReadLink = libCommon.getStateVariable(context, 'LAMHeaderReadLink');
    binding.TempLAMLRPId = lamObj.LRPId;
    binding.TempLAMUOM = lamObj.UOM;
    binding.TempLAMLength = String(libLocal.toNumber(context, lamObj.Length,'',false));
    binding.TempLAMStartPoint = String(libLocal.toNumber(context, lamObj.StartPoint,'',false));
    binding.TempLAMEndPoint = String(libLocal.toNumber(context, lamObj.EndPoint,'',false));
    binding.TempLAMStartMarker = lamObj.StartMarker;
    binding.TempLAMEndMarker = lamObj.EndMarker;
    binding.TempLAMMarkerUOM = lamObj.MarkerUOM;
    binding.TempLAMOffset1Type = lamObj.Offset1Type;
    binding.TempLAMOffset1Value = String(libLocal.toNumber(context, lamObj.Offset1Value,'',false));
    binding.TempLAMOffset1UOM = lamObj.Offset1UOM;
    binding.TempLAMOffset2Type = lamObj.Offset2Type;
    binding.TempLAMOffset2Value = String(libLocal.toNumber(context, lamObj.Offset2Value,'',false));
    binding.TempLAMOffset2UOM = lamObj.Offset2UOM;
    binding.TempLAMStartMarkerDistance = String(libLocal.toNumber(context, lamObj.StartMarkerDistance,'',false));
    binding.TempLAMEndMarkerDistance = String(libLocal.toNumber(context, lamObj.EndMarkerDistance,'',false));
}
