import libCommon from '../Common/Library/CommonLibrary';

export default function MobileStatusSuccess(context) {
    return libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/SuccessParameterName.global').getValue());    
}
