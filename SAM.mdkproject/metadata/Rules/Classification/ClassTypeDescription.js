/**
   * Get the class type and description and display on list view
   * 
   * @param {sectionTable} context
   * 
   * @returns {string} get the class type and description
   * 
   */
import libVal from '../Common/Library/ValidationLibrary';
export default function ClassTypeDescription(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `ClassTypes('${context.binding.ClassType}')`, [], '').then(function(result) {
        if (!libVal.evalIsEmpty(result)) {
            return result.getItem(0).ClassType + ' - ' + result.getItem(0).Description ;
        } 
        return '-';
    });
}
