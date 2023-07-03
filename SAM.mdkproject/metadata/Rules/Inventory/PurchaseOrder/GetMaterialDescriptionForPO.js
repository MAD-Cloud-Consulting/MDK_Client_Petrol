import GetMaterialDescription from '../IssueOrReceipt/GetMaterialDescription';

/**
 * Show material id and description for purchase order document items
 * @param {*} context 
 * @returns <material id><space><material desc>
 */
export default function GetMaterialDescriptionForPO(context) {
    //we want to show <material id><space><material desc> for the ObjectCell subhead 
    //in POMaterialDocItemsList.page as outlined by global design in the figma.
    return GetMaterialDescription(context, ' ');
}
