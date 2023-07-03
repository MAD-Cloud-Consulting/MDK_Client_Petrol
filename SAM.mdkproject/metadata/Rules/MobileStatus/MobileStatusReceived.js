import libCommon from '../Common/Library/CommonLibrary';

export default function MobileStatusReceived(context) {
    return libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());    
}
