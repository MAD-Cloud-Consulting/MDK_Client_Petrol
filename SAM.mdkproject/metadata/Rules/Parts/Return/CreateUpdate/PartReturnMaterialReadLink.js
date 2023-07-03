/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function PartReturnMaterialReadLink(context) {
    return `Materials('${context.binding.MaterialNum}')`;
}
