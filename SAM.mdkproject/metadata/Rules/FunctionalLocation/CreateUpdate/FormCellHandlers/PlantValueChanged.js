import PlantValueChangedCommon from '../../../Common/Controls/Handlers/PlantValueChanged';

export default function PlantValueChanged(context) {
    PlantValueChangedCommon(context);
    context.getPageProxy().getControl('FormCellContainer').getControl('SuperiorFuncLocHierarchyExtensionControl')._control._extension.reload();               
}
