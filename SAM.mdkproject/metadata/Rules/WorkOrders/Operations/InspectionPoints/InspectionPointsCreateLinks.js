import libVal from '../../../Common/Library/ValidationLibrary';

export default function InspectionPointsCreateLinks(context) {
    let links = [];
    if (context.binding.hasOwnProperty('InspCode_Nav') && libVal.evalIsEmpty(context.binding.InspCode_Nav)) {
        links.push({
            'Property': 'InspCode_Nav',
            'Target': {
                'EntitySet': 'InspectionCodes',
                'ReadLink': `InspectionCodes(Plant='${context.binding.ClientData.Plant}',SelectedSet='${context.binding.ClientData.ValSelectedSet}',Catalog='${context.binding.ClientData.ValCatalog}',CodeGroup='${context.binding.ClientData.ValCodeGroup}',Code='${context.binding.ClientData.ValCode}')`,
            },
        });
    } 

    if (context.binding.hasOwnProperty('InspValuation_Nav') && libVal.evalIsEmpty(context.binding.InspValuation_Nav)) {
        links.push({
            'Property': 'InspValuation_Nav',
            'Target': {
                'EntitySet': 'InspectionCatalogValuations',
                'ReadLink': `InspectionCatalogValuations('${context.binding.ClientData.Valuation}')`,
            },
        });
    } 
    return links;
}
