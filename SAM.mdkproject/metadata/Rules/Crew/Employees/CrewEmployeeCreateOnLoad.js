import Stylizer from '../../Common/Style/Stylizer';
import libCom from '../../Common/Library/CommonLibrary';

export default function CrewEmployeeCreateOnLoad(context) {

    let employeeListPicker = context.getControl('FormCellContainer').getControl('EmployeeLstPkr');   
    
    let stylizer = new Stylizer(['GrayText']);
    stylizer.apply(employeeListPicker , 'Value');
    libCom.saveInitialValues(context);
}
