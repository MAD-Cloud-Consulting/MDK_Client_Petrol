import inspCharLib from './InspectionCharacteristics';

export default function InspectionCharacteristicsQualitativeIsVisible(context) {
    let binding = context.binding;
    if (inspCharLib.isQualitative(binding)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'InspectionCodes', [], '$filter=(SelectedSet eq \'' + binding.SelectedSet + '\' and Plant eq \'' + binding.SelectedSetPlant + '\' and Catalog eq \'' + binding.Catalog + '\')').then( results => {
            return results.length > 4;
        });
    }
    return false;
}
