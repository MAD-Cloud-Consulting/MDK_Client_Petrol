import inspCharLib from './InspectionCharacteristics';
import MyButtonLib from '../../../../SAPAssetManager/Extensions/ButtonStackModule/ButtonStackLibrary';
import deviceType from '../../Common/DeviceType';

export default function InspectionCharacteristicsQualitativeOnChange(context) {
    let name = context.getName();
    let suffix = name.substring(name.indexOf('_'), name.length);
    let value = '';
    let valuationControl = 'Valuation' + suffix;
    let binding = context.binding;
    if (inspCharLib.isQualitative(binding)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'InspectionCodes', [], '$filter=(SelectedSet eq \'' + binding.SelectedSet + '\' and Plant eq \'' + binding.SelectedSetPlant + '\' and Catalog eq \'' + binding.Catalog + '\')').then( results => {
            let qualitativeControl = (results.length <= 4 ? 'QualitativeValueSegment' : 'QualitativeValue') + suffix;
            let readLink = context.getPageProxy().getControl('FormCellContainer')._control.getCellProxyWithName(qualitativeControl).getValue()[0].ReturnValue;
            return context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], '').then(function(result) {
                if (result != null) {
                    value = "InspectionResultValuations('" + result.getItem(0).ValuationStatus + "')";
                    binding.Valuation = result.getItem(0).ValuationStatus;

                    let valCtrl = context.getPageProxy().getControl('FormCellContainer')._control.getCellProxyWithName(valuationControl);
                    let valCtrlSpecifier = valCtrl.getTargetSpecifier();
                    valCtrlSpecifier.setQueryOptions("$filter=Valuation eq '" + binding.Valuation + "'");
                    valCtrl.setTargetSpecifier(valCtrlSpecifier);
                    valCtrl.setValue(value);

                    let extensionName;
                    let recordDefectsButtonName;

                    if (deviceType(context) === 'Tablet') {
                        extensionName = 'MyExtensionControlName';
                        recordDefectsButtonName = 'RecordDefectsButtonTablet';
                    } else {
                        extensionName = 'MyExtensionControlNameRecordDefect';
                        recordDefectsButtonName = 'RecordDefectsButton';
                    }
    
                    let buttonStack = extensionName + suffix;
                    let contextProxy = context._control._parent.getCellProxyWithName(buttonStack)._control._extension.context._clientAPI;
                    switch (context.binding.Valuation) {
                        case 'A':
                            valCtrl.setStyle('AcceptedGreen','Value');
                            break;
                        case 'R':
                        case 'F':
                            valCtrl.setStyle('RejectedRed','Value');
                            break;
                        default:
                            valCtrl.setStyle('GrayText','Value');
                            break;
                    }                  
                    if (context.binding.Valuation === 'R') {
                        if (inspCharLib.isManualDefectRecordingEnable(context)) {
                            MyButtonLib.setEditable(contextProxy, recordDefectsButtonName, true);
                        }
                    } else {
                        if (inspCharLib.isManualDefectRecordingEnable(context)) {
                            MyButtonLib.setEditable(contextProxy, recordDefectsButtonName, false);
                        }
                    }
                    context.getPageProxy().getControl('FormCellContainer').redraw();
                    context.clearValidationOnValueChange();
                }
            });
        });
    }
}
