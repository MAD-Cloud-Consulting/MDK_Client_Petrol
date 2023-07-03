import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';
import libEval from '../Common/Library/ValidationLibrary';
import contextConverter from '../Meter/BusinessPartners/BusinessPartnerContextConverter';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
export default function BusinessPartnerName(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
        contextConverter(context);
    }
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let name = wrapper.name();
    return libEval.evalIsEmpty(name) ? '-' : name;
}
