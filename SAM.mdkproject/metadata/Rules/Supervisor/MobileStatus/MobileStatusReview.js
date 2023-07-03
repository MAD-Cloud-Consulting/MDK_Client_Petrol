import libCommon from '../../Common/Library/CommonLibrary';

export default function MobileStatusReview(context) {
    return libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());    
}
