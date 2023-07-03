import libCommon from '../Common/Library/CommonLibrary';

export default function MobileStatusStarted(context) {
    return libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());    
}
