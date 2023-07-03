import libCommon from '../Common/Library/CommonLibrary';

export default function MobileStatusTransfer(context) {
    return libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());    
}
