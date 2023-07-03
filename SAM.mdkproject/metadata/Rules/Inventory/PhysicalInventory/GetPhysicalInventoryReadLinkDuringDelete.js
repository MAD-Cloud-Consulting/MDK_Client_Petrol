import libCom from '../../Common/Library/CommonLibrary';

export default function GetPhysicalInventoryReadLinkDuringDelete(context) {
    
    return libCom.getStateVariable(context, 'PI_ReadLink_Header');
}
