import libCom from '../Common/Library/CommonLibrary';
import ODataDate from '../Common/Date/ODataDate';

export class EquipmentCreateUpdateLibrary {
    /**
     * set values of the page's control
     * @param {IPageProxy} pageProxy
     * @param {Object} equipment data object
     * @static
     * 
     */
    static setValues(pageProxy, Equipment) {
        libCom.getControlProxy(pageProxy, 'CategoryLstPkr').setValue(Equipment.EquipCategory || '');
        libCom.getControlProxy(pageProxy, 'MaintenacePlantLstPkr').setValue(Equipment.MaintPlant || '');
        libCom.getControlProxy(pageProxy, 'ManufactureNameProperty').setValue(Equipment.Manufacturer || '');
        libCom.getControlProxy(pageProxy, 'ModelNumberProperty').setValue(Equipment.ModelNum || '');
        libCom.getControlProxy(pageProxy, 'SerialNumberProperty').setValue(Equipment.ManufSerialNo || '');
        libCom.getControlProxy(pageProxy, 'RoomProperty').setValue(Equipment.Room || '');
        libCom.getControlProxy(pageProxy, 'LocationLstPkr').setValue(Equipment.Location_Nav ? [Equipment.Location_Nav['@odata.readLink']] : '');

        if (libCom.getControlProxy(pageProxy, 'CreateFromLstPkr').getValue()[0].ReturnValue === 'PREVIOUSLY_CREATED') {
            libCom.getControlProxy(pageProxy, 'DescriptionNote').setValue(Equipment.EquipDesc || '');
        }

        if (Equipment.ConstMonth && Equipment.ConstYear) {
            let date = new Date();
            date.setFullYear(Equipment.ConstYear);
            date.setMonth((Equipment.ConstMonth - 1).toString());

            libCom.getControlProxy(pageProxy, 'ManufactureDatePicker').setValue(date);
        }

        if (Equipment.StartDate) {
            let startDate = new ODataDate().toLocalDateString(Equipment.StartDate);
            libCom.getControlProxy(pageProxy, 'StartDatePicker').setValue(startDate);
        }


        libCom.setStateVariable(pageProxy, 'CopyValues', []);
        libCom.setStateVariable(pageProxy, 'CopyEquipId', Equipment.CopyEquipId);
        libCom.getControlProxy(pageProxy, 'IncludeFormReferenceLstPkr').setValue([]);
    }   
}
