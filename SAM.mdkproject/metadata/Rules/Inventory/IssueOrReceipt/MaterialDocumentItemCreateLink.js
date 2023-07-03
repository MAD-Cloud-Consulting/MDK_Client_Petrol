import libVal from '../../Common/Library/ValidationLibrary';
import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';
import GetMaterialDocumentItemReadLink from '../MaterialDocumentItem/GetMaterialDocumentItemReadLink';

export default function MaterialDocumentItemCreateLink(context) {
    var links = [];
    let matDocItemLink = ''; //Changeset, mat doc was just created
    let vehicleFlag = EnableMultipleTechnician(context);
    
    if (!libVal.evalIsEmpty(context.binding) && !libVal.evalIsEmpty(context.binding.TempLine_MatDocItemReadLink)) {
        // edit material document item
        matDocItemLink = context.binding.TempLine_MatDocItemReadLink;
    } else if (!libVal.evalIsEmpty(context.getActionBinding()) && libVal.evalIsEmpty(context.getActionBinding().TempHeader_MatDocReadLink)) {
        // create material doc item and  material doc  - changeset 
        matDocItemLink = 'pending_2';
    } else if (!libVal.evalIsEmpty(context.binding) && libVal.evalIsEmpty(context.binding.TempHeader_MatDocReadLink)) {
        // create material doc item and  material doc  - changeset 
        matDocItemLink = 'pending_2';
    } else {
        // create realted material doc item with existing material doc
        matDocItemLink = GetMaterialDocumentItemReadLink(context);
    }
    if (vehicleFlag) {
        let MatDocItemReadLink = context.getClientData().TempLine_MatDocItemReadLink;
        matDocItemLink = !libVal.evalIsEmpty(MatDocItemReadLink) ? MatDocItemReadLink : 'pending_2';
    }
    links.push({
        'Property': 'MatDocItem_Nav',
        'Target':
        {
            'EntitySet': 'MaterialDocItems',
            'ReadLink': matDocItemLink,
        },
    });
    return links;
}
