import libCom from '../../Common/Library/CommonLibrary';

export default function GetMyInventoryObjectReadLinkDuringDelete(context) {
    
    return libCom.getStateVariable(context, 'PI_ReadLink_Parent');
}
