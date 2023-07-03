import libCommon from '../../Common/Library/CommonLibrary';
import mobileStatusEAMObjectType from '../../MobileStatus/MobileStatusEAMObjectType';

export default function MobileStatusReviewUpdateLinks(context) {
    var updateLinks = [];
    const reviewMobileStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    const eamObjType = mobileStatusEAMObjectType(context);
    let overallStatusCfg_NavLink = context.createLinkSpecifierProxy(
        'OverallStatusCfg_Nav',
        'EAMOverallStatusConfigs',
        `$filter=MobileStatus eq '${reviewMobileStatus}' and ObjectType eq '${eamObjType}'`
    );
    updateLinks.push(overallStatusCfg_NavLink.getSpecifier());
    //return updateLinks;
    return [];
}
