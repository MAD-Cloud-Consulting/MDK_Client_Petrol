import Stylizer from '../../Common/Style/Stylizer';
import libCom from '../../Common/Library/CommonLibrary';

export default function CrewVehicleCreateOnLoad(context) {

    let vehicleListPicker = context.getControl('FormCellContainer').getControl('VehicleLstPkr');   
    
    let stylizer = new Stylizer(['GrayText']);
    stylizer.apply(vehicleListPicker , 'Value');
    libCom.saveInitialValues(context);
}
