import WorkCenterControl from '../../../Common/Controls/WorkCenterControl';
import WorkCenterPlantControl from '../../../Common/Controls/WorkCenterPlantControl';

export default function SubOperationCreateUpdateDefault(control) {
    let controlName = control.getName();

    switch (controlName) {
        case 'WorkCenterLstPkr':
            return WorkCenterControl.getSubOperationPageDefaultValue(control);
        case 'WorkCenterPlantLstPkr':
            return WorkCenterPlantControl.getSubOperationPageDefaultValue(control);
        default:
            return '';
    }
}
