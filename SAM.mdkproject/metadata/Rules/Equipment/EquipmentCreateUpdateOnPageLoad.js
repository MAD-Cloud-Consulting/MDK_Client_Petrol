import libCom from '../Common/Library/CommonLibrary';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import EquipmentLocalID from './CreateUpdate/EquipmentGenerateLocalId';
import CreateFromValueChanged from './CreateUpdate/FormCellHandlers/CreateFromValueChanged';

/**
 * Triggered when the create/edit page is loaded
 * @param {IPageProxy} pageClientAPI
 */
export default function equipmentCreateUpdateOnPageLoad(pageClientAPI) {
    if (!pageClientAPI.getClientData().LOADED) {
        let onCreate = libCom.IsOnCreate(pageClientAPI);

        setPageTitle(pageClientAPI, onCreate);

        if (ValidationLibrary.evalIsEmpty(pageClientAPI.binding)) {
            setDefaultValuesForUndefinedBinding(pageClientAPI);
        } else {
            setDefaultValues(pageClientAPI);
        }

        if (!onCreate) {
            disalbleControlsOnEdit(pageClientAPI);
        } else {
            CreateFromValueChanged(pageClientAPI);
        }

        pageClientAPI.getClientData().LOADED = true;
    }
}


function disalbleControlsOnEdit(pageProxy) {
    libCom.getControlProxy(pageProxy, 'CreateFromLstPkr').setVisible(false);

    if (pageProxy.binding.CopyEquipId) {
        libCom.getControlProxy(pageProxy, 'IncludeFormReferenceLstPkr').setVisible(true);
    }
}
/**
 * Set the default values of the page's control when the binding is undefined
 * @param  {IPageProxy} clientAPI
 */
function setDefaultValuesForUndefinedBinding(clientAPI) {
    libCom.getControlProxy(clientAPI, 'IdProperty').setValue(EquipmentLocalID(clientAPI));

    const locationPicker = libCom.getControlProxy(clientAPI, 'LocationLstPkr');
    locationPicker.setEditable(false);
    libCom.getControlProxy(clientAPI, 'LocationLstPkr').setValue('');
}

/** 
 * set the default values of the page's control
 * @param {IPageProxy} pageProxy
 * 
 */
function setDefaultValues(pageProxy) {
    libCom.getControlProxy(pageProxy, 'IdProperty').setValue(pageProxy.binding.EquipId || EquipmentLocalID(pageProxy));

    libCom.getControlProxy(pageProxy, 'CategoryLstPkr').setValue(pageProxy.binding.EquipCategory || '');
    libCom.getControlProxy(pageProxy, 'DescriptionNote').setValue(pageProxy.binding.EquipDesc || '');
    libCom.getControlProxy(pageProxy, 'MaintenacePlantLstPkr').setValue(pageProxy.binding.MaintPlant || '');
    libCom.getControlProxy(pageProxy, 'ManufactureNameProperty').setValue(pageProxy.binding.Manufacturer || ''); 
    libCom.getControlProxy(pageProxy, 'ModelNumberProperty').setValue(pageProxy.binding.ModelNum || ''); 
    libCom.getControlProxy(pageProxy, 'SerialNumberProperty').setValue(pageProxy.binding.SerialNumber || '');
    libCom.getControlProxy(pageProxy, 'RoomProperty').setValue(pageProxy.binding.Room || ''); 
    libCom.getControlProxy(pageProxy, 'SerialNumberProperty').setValue(pageProxy.binding.ManufSerialNo || '');
    libCom.setStateVariable(pageProxy, 'CopyValues', []);

    if (pageProxy.binding.ConstMonth && pageProxy.binding.ConstYear) {
        let date = new Date();
        date.setFullYear(pageProxy.binding.ConstYear);
        date.setMonth((pageProxy.binding.ConstMonth - 1).toString());
        libCom.getControlProxy(pageProxy, 'ManufactureDatePicker').setValue(date);
    }


    const locationPicker = libCom.getControlProxy(pageProxy, 'LocationLstPkr');

    if (pageProxy.binding.Location) {
        locationPicker.setEditable(true);
        locationPicker.setValue([`Locations(Location='${pageProxy.binding.Location}',Plant='${pageProxy.binding.MaintPlant}')`]);
    } else if (pageProxy.binding.MaintPlant) {
        locationPicker.setEditable(true);
        libCom.getControlProxy(pageProxy, 'LocationLstPkr').setValue('');
    } else {
        locationPicker.setEditable(false);
        libCom.getControlProxy(pageProxy, 'LocationLstPkr').setValue('');
    }

    let aCopyFlags = [];

    if (pageProxy.binding.CopyClassification) { 
        aCopyFlags.push('CLASSIFICATIONS_TO_COPY');
    }

    if (pageProxy.binding.CopyClassificationValues) { 
        aCopyFlags.push('CLASSIFICATION_VALUES_TO_COPY');
    }

    if (pageProxy.binding.CopyDocuments) { 
        aCopyFlags.push('DOCUMENT_TO_COPY');
    }

    if (pageProxy.binding.CopyMeasuringPoints) { 
        aCopyFlags.push('MEASURING_POINTS_TO_COPY');
    }

    if (pageProxy.binding.CopyPartners) { 
        aCopyFlags.push('PARTNERS_TO_COPY');
    }

    if (pageProxy.binding.CopyNote) { 
        aCopyFlags.push('NOTE_TO_COPY');
    }

    if (pageProxy.binding.CopyInstallLocation) { 
        aCopyFlags.push('INSTALL_LOCATION_TO_COPY');
    }

    libCom.getControlProxy(pageProxy, 'IncludeFormReferenceLstPkr').setValue(aCopyFlags);

    pageProxy.getClientData().DefaultValuesLoaded = true;
}

/**
 * Private method of setting title when the page is loaded
 * @param {IPageProxy} context
 * @param {boolean} onCreate flag of the current page state (create/edit)
 */
function setPageTitle(context, onCreate) {
    let title = '';
    if (onCreate) {
        title = context.localizeText('add_equipment');
    } else {
        title = context.localizeText('edit_equipment');
    }
    context.setCaption(title);
}
