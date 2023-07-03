import libVal from '../../../Common/Library/ValidationLibrary';

export default function InspectionPointsInspectionCodeInitialValue(context) {
    if (context.binding.hasOwnProperty('InspCode_Nav') && !libVal.evalIsEmpty(context.binding.InspCode_Nav)) {
        let ClientData = {};
        ClientData.Valuation = context.binding.InspCode_Nav.ValuationStatus;
        ClientData.ValSelectedSet=context.binding.InspCode_Nav.SelectedSet;
        ClientData.ValCatalog=context.binding.InspCode_Nav.Catalog;
        ClientData.ValCode=context.binding.InspCode_Nav.Code;
        ClientData.ValCodeGroup=context.binding.InspCode_Nav.CodeGroup;
        ClientData.Plant=context.binding.InspCode_Nav.Plant;
        context.binding.ClientData = ClientData;
        return context.binding.InspCode_Nav['@odata.readLink'];
    }
}
