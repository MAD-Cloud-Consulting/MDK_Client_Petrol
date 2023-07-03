import libCom from '../Common/Library/CommonLibrary';
export default function ChartType(context) {
    /**
     * PRT Measuring Point Case
     */
    let binding = context.binding;
    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
       binding = binding.PRTPoint;
    }
    /**Code group and CharName determine if val code only. Else render charts accordingly*/
    if (libCom.isDefined(binding.CodeGroup)) {
        if (!libCom.isDefined(binding.CharName)) {
            return 'valCode';
        } else {
            if (binding.IsCounter === 'X') {
                return 'Column';
            } else {
                return 'Line';
            }
        }
    } else {
        if (binding.IsCounter === 'X') {
            return 'Column';
        } else {
            return 'Line';
        }
    }
}
