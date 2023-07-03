import Stylizer from '../../Common/Style/Stylizer';
import libCommon from '../../Common/Library/CommonLibrary';

export default function CharacteristicCreateUpdatePageOnLoad(context) {

    let controlDescription = context.getControl('FormCellContainer').getControl('Description');
    let controlName = context.getControl('FormCellContainer').getControl('Name');
    let controlUnit = context.getControl('FormCellContainer').getControl('Unit');

    
    libCommon.setStateVariable(context,'CharValCountIndex', 0);
    libCommon.setStateVariable(context,'HighestCounter', 0);
    let textReadOnlyStyle = new Stylizer(['FormCellReadOnlyEntry']);


    textReadOnlyStyle.apply(controlDescription, 'Value');
    textReadOnlyStyle.apply(controlName, 'Value');
    if (controlUnit) {
        textReadOnlyStyle.apply(controlUnit, 'Value');
    }
    libCommon.saveInitialValues(context);
}
