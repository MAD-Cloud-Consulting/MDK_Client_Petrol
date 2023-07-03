import libCommon from '../Common/Library/CommonLibrary';

export default function MobileStatusCompleted(context) {
    return libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());    
}
