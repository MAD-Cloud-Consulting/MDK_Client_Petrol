import libCom from '../../Common/Library/CommonLibrary';

export default function LAMUpdateNav(context) {
    
    libCom.setStateVariable(context, 'TransactionType', 'UPDATE');
    return context.executeAction('/SAPAssetManager/Actions/LAM/LAMCreateNav.action');
           
}
