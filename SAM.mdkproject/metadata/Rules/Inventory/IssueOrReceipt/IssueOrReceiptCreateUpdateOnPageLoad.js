import libCom from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import EnableMultipleServiceTechnician from '../../SideDrawer/EnableMultipleTechnician';

export default function IssueOrReceiptCreateUpdateOnPageLoad(context) {
    const dict = libCom.getControlDictionaryFromPage(context);
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const move = libCom.getStateVariable(context, 'IMMovementType');
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const materialType = 'MaterialSLoc';
    
    if (context.binding && context.binding.AutoGenerateSerialNumbers === 'X') {
        dict.AutoSerialNumberSwitch.setVisible(true);
        dict.SerialPageNav.setVisible(false);
    }

    if (move !== 'R' && (libCom.getPageName(context) !== 'VehicleIssueOrReceiptCreatePage') && !ValidationLibrary.evalIsEmpty(dict.AutoSerialNumberSwitch)) {
        dict.AutoSerialNumberSwitch.setVisible(false);
    }

    if (EnableMultipleServiceTechnician(context) && (libCom.getPageName(context) === 'VehicleIssueOrReceiptCreatePage')) {
        const fromTransferType = '$(L,from_vehicle)';
        const toTransferType = '$(L,to_vehicle)';
        const userSLoc = libCom.getUserDefaultStorageLocation();
        let materialListPicker = libCom.getControlProxy(context,'MaterialLstPkr');
        let serialNumButton = libCom.getControlProxy(context,'SerialPageNav');
        let sLocPicker = libCom.getControlProxy(context,'StorageLocationLstPkr');
        let sLocPickerSpecifier = sLocPicker.getTargetSpecifier();
        let transferValue = fromTransferType;
        if (context.binding) {
            let isRecentScreen = libCom.getPreviousPageName(context) === 'MaterialDocumentDetails';
            let materialValue = context.binding['@odata.readLink'];
            if (isRecentScreen && !libCom.IsOnCreate(context)) {
                let isTransferFrom = (libCom.getUserDefaultPlant(context) === context.binding.Plant) && (libCom.getUserDefaultStorageLocation(context) === context.binding.StorageLocation);
                transferValue = isTransferFrom ? fromTransferType : toTransferType;
                libCom.getControlProxy(context,'TransferSeg').setValue(transferValue);
                let materialPlant = isTransferFrom ? context.binding.Plant : context.binding.MovePlant;
                let materialSLoc = isTransferFrom ? context.binding.StorageLocation : context.binding.MoveStorageLocation;
                let plantPickerValue = !isTransferFrom ? context.binding.Plant : context.binding.MovePlant;
                let storageLocPickerValue = !isTransferFrom ? context.binding.StorageLocation : context.binding.MoveStorageLocation;
                libCom.getControlProxy(context,'PlantLstPkr').setValue(plantPickerValue);
                sLocPicker.setValue(storageLocPickerValue);
                let UOM = context.binding.UOM;
                libCom.getControlProxy(context,'MaterialUOMLstPkr').setValue(UOM);
                let quantity = context.binding.EntryQuantity || (context.binding.SerialNum && context.binding.SerialNum.length);
                libCom.getControlProxy(context,'QuantitySimple').setValue(quantity);
                materialValue = `MaterialSLocs(Plant='${materialPlant}',StorageLocation='${materialSLoc}',MaterialNum='${context.binding.Material}')`;
            }
            materialListPicker.setValue(materialValue);
                
            if (context.binding.hasOwnProperty('MaterialPlant') && !ValidationLibrary.evalIsEmpty(context.binding.MaterialPlant.SerialNumberProfile)) {
                serialNumButton.setVisible(true);
            } else {
                serialNumButton.setVisible(false);
            }
        } else {
            serialNumButton.setVisible(false);
        }
        if (libCom.isDefined(userSLoc) && transferValue === fromTransferType) {
            sLocPickerSpecifier.setQueryOptions(`$filter=StorageLocation ne '${userSLoc}'&$orderby=StorageLocation`);
            sLocPicker.setTargetSpecifier(sLocPickerSpecifier);
        }
    }
    if (objectType === 'STO' || objectType === 'PO' || objectType === 'RES' || objectType === 'REV' || objectType === 'PRD') {
        const confirmedValue = Number(libCom.getControlProxy(context,'ConfirmedQuantitySimple').getValue().split(' ')[0]);
        libCom.setStateVariable(context, 'ConfirmedFilled', confirmedValue);
        
        const quantitySimple = Number(libCom.getControlProxy(context,'QuantitySimple').getValue());
        libCom.setStateVariable(context, 'OpenQuantity', quantitySimple);
    } 

    if ((objectType === 'MAT' || objectType === 'TRF') && type === materialType) {
        libCom.setStateVariable(context, 'MaterialReadLink', context.binding['@odata.readLink']);
    }

    libCom.setStateVariable(context, 'SerialNumbers', {actual: null, initial: null});
    hideCancel(context);
    libCom.saveInitialValues(context);
}
