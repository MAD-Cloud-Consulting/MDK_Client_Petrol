import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';
import libCom from '../Common/Library/CommonLibrary';
import libEval from '../Common/Library/ValidationLibrary';
import contextConverter from '../Meter/BusinessPartners/BusinessPartnerContextConverter';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function BusinessPartnerEmail(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
        contextConverter(context);
    }
    let pageName = libCom.getPageName(context);
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let email = wrapper.communicationProperty('Email');
    let emptyVal = pageName === 'BusinessPartnerDetailsPage' ? '-' : '';
    return libEval.evalIsEmpty(email) ? emptyVal : email;    
}
