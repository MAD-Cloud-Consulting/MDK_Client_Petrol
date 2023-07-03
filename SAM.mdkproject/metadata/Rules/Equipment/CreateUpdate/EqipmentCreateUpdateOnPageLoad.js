import style from '../../Common/Style/StyleFormCellButton';
import libCom from '../../Common/Library/CommonLibrary';
import equipmentCreateUpdateOnPageLoad from '../EquipmentCreateUpdateOnPageLoad';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';

export default function EqipmentCreateUpdateOnPageLoad(clientAPI) {
    // clear the geometry cache
    ApplicationSettings.setString(clientAPI, 'Geometry', '');

    equipmentCreateUpdateOnPageLoad(clientAPI);
    style(clientAPI, 'DiscardButton');

    libCom.saveInitialValues(clientAPI);
}
