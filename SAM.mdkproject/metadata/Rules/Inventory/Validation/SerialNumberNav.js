import libCom from '../../Common/Library/CommonLibrary';
import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';
import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';

export default function SerialNumberNav(context) {
    const control = context.getPageProxy().getControl('FormCellContainer');
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const page =  libCom.getPageName(context);
    const isVehicle = (page === 'VehicleIssueOrReceiptCreatePage') && EnableMultipleTechnician(context);
    const Batch = !isVehicle && control.getControl('BatchSimple').getValue();
    const StorageBin = !isVehicle && control.getControl('StorageBinSimple').getValue();
    let UOM = '';
    let Material = '';

    if (context.binding && !isVehicle) {
        UOM = context.binding.OrderUOM || context.binding.UOM || context.binding.RequirementUOM || context.binding.EntryUOM;
        
        if (objectType === 'ADHOC' || objectType === 'TRF' || objectType === 'MAT') {
            libCom.setStateVariable(context, 'OpenQuantity', control.getControl('QuantitySimple').getValue());
            UOM = context.binding.EntryUOM || context.binding.Material.BaseUOM;
        } else if (objectType === 'IB' || objectType === 'OB') {
            const openQuantity = Number(control.getControl('QuantitySimple').getValue()) - Number(control.getControl('ConfirmedQuantitySimple').getValue());
            libCom.setStateVariable(context, 'OpenQuantity', openQuantity);
        }
        
    } else {
        UOM = isVehicle ? (control.getControl('MaterialUOMLstPkr').getValue().length && control.getControl('MaterialUOMLstPkr').getValue()[0].ReturnValue) : control.getControl('UOMSimple').getValue();
        Material = !isVehicle && control.getControl('MatrialListPicker').getValue()[0].DisplayValue.Title.split('-')[0];
        if (isVehicle) {
            let readLink = control.getControl('MaterialLstPkr').getValue()[0].ReturnValue;
            Material = SplitReadLink(readLink).MaterialNum;

        }
        libCom.setStateVariable(context, 'OpenQuantity', control.getControl('QuantitySimple').getValue());
    }
    libCom.setStateVariable(context, 'SerialPageBinding', {UOM, Batch, StorageBin, Material});
    
    context.executeAction('/SAPAssetManager/Actions/Inventory/SerialNumbers/SerialNumber.action');
}
