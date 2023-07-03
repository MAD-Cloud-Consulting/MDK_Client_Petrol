import libCommon from '../../../Common/Library/CommonLibrary';
import PlantValueChangedCommon from '../../../Common/Controls/Handlers/PlantValueChanged';

export default function PlantValueChanged(context) {
    PlantValueChangedCommon(context);
    libCommon.clearValidationOnInput(context);
    let flocExtension = context.getPageProxy().getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl')._control._extension;
    if (flocExtension) {
        flocExtension.reload();
    }
}
