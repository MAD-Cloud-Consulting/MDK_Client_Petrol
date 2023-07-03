import libCom from '../../../Common/Library/CommonLibrary';

export default function InspectionLotSetUsageOnValueChange(context) {
    
    let pageProxy = context.getPageProxy();
    let valuationControl = libCom.getControlProxy(pageProxy, 'Valuation');
    let qualityScoreControl = libCom.getControlProxy(pageProxy, 'QualityScore');

    let selection = context.getValue()[0] ? context.getValue()[0].ReturnValue : '';

    if (selection) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', selection, [], '$expand=InspValuation_Nav').then((valuation) => {
            if (valuation.length > 0) {
                let inspectionCodeObject = valuation.getItem(0);
                pageProxy.getClientData().InspectionCode = inspectionCodeObject;
                if (inspectionCodeObject.InspValuation_Nav) {
                    valuationControl.setValue(inspectionCodeObject.InspValuation_Nav.ShortText);
                }
                qualityScoreControl.setValue(inspectionCodeObject.QualityScore);
            }
        });
    } else {
        valuationControl.setValue('');
        qualityScoreControl.setValue('');
    }
}
