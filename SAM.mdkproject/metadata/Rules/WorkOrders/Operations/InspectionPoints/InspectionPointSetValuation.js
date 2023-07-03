import libVal from '../../../Common/Library/ValidationLibrary';

export default function InspectionPointSetValuation(context) {
    if (!libVal.evalIsEmpty(context.getValue()[0])) {
        let readlink = context.getValue()[0].ReturnValue;
        return context.read('/SAPAssetManager/Services/AssetManager.service', readlink, [], '$expand=InspValuation_Nav').then((valuation) => {
            if (valuation.length > 0) {
                let ClientData = {};
                ClientData.Valuation = valuation.getItem(0).ValuationStatus;
                ClientData.ValSelectedSet=valuation.getItem(0).SelectedSet;
                ClientData.ValCatalog=valuation.getItem(0).Catalog;
                ClientData.ValCode=valuation.getItem(0).Code;
                ClientData.ValCodeGroup=valuation.getItem(0).CodeGroup;
                ClientData.Plant=valuation.getItem(0).Plant;
                context.binding.ClientData = ClientData;
            }
        });
    }
}
