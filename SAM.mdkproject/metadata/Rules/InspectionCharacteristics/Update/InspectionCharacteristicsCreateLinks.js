import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionCharacteristicsCreateLinks(context) {
    var links = [];

    if (libVal.evalIsEmpty(context.binding.InspValuation_Nav) && !libVal.evalIsEmpty(libCom.getControlProxy(context, 'Valuation').getValue()[0])) {
        links.push({
            'Property': 'InspValuation_Nav',
            'Target':
            {
                'EntitySet': 'InspectionResultValuations',
                'ReadLink': libCom.getControlProxy(context, 'Valuation').getValue()[0].ReturnValue,
            },
        });
    } 
    if (libVal.evalIsEmpty(context.binding.InspectionCode_Nav) && !libVal.evalIsEmpty(libCom.getControlProxy(context, 'QualitativeValueSegment').getValue()[0])) {
        links.push({
            'Property': 'InspectionCode_Nav',
            'Target':
            {
                'EntitySet': 'InspectionCodes',
                'ReadLink': libCom.getControlProxy(context, 'QualitativeValueSegment').getValue()[0].ReturnValue,
            },
        });
    } else if (libVal.evalIsEmpty(context.binding.InspectionCode_Nav) && !libVal.evalIsEmpty(libCom.getControlProxy(context, 'QualitativeValue').getValue()[0])) {
        links.push({
            'Property': 'InspectionCode_Nav',
            'Target':
            {
                'EntitySet': 'InspectionCodes',
                'ReadLink': libCom.getControlProxy(context, 'QualitativeValue').getValue()[0].ReturnValue,
            },
        });
    }
    return links;
}
