import libEval from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';

export default function MaterialLstPkrQueryOptions(context) {
    try {
        let isMultipleTechnician = EnableMultipleTechnician(context);
        let pageName = libCom.getPageName(context);
        
        if (isMultipleTechnician && pageName !== 'PartCreateUpdatePage') { // we need that part only if we are on VehicleIssueOrReceiptCreatePage or VehiclePartCreate
            let searchString = context.searchString;
            let filters = [];
            let filter = '';
            if (searchString) {
                filters.push(`substringof('${searchString.toLowerCase()}', tolower(MaterialNum))`);
                filters.push(`substringof('${searchString.toLowerCase()}', tolower(Material/Description))`);
                
                filter = '(' + filters.join(' or ') + ') and ';
            }
            let plantValue = libCom.getUserDefaultPlant();
            let storageLoc = libCom.getUserDefaultStorageLocation();
            return `$orderby=MaterialNum&$expand=Material,MaterialPlant&$filter=${filter}StorageLocation eq '${storageLoc}' and Plant eq '${plantValue}'`;
        }
        // Get values from controls
        let plant = context.getPageProxy().evaluateTargetPath('#Control:PlantLstPkr/#SelectedValue');
        let slocValues = context.getPageProxy().evaluateTargetPath('#Control:StorageLocationLstPkr/#Value');
        let materialNumber = context.getPageProxy().evaluateTargetPath('#Control:MaterialNumber').getValue();
        let materialDescription = context.getPageProxy().evaluateTargetPath('#Control:MaterialDescription').getValue();
        let onlineSwitchValue = context.getPageProxy().evaluateTargetPath('#Control:OnlineSwitch').getValue();

        if (context.binding['@odata.type'] === '#sap_mobile.BOMItem') {
            materialNumber = context.binding.Component;
        }

        if (libEval.evalIsEmpty(materialNumber)) {
            materialNumber = context.getPageProxy().binding.MaterialNum;
        }

        let materialLstPkrQueryOptions = context.dataQueryBuilder();

        materialLstPkrQueryOptions.expand('Material,MaterialPlant');

        let newFilterOpts = [`Plant eq '${plant}'`];
        if (slocValues.length > 0) {
            let slocValuesQuery = [];
            for (let i in slocValues) {
                if (!libEval.evalIsEmpty(slocValues[i])) {
                    slocValuesQuery.push(`StorageLocation eq '${slocValues[i].ReturnValue}'`);
                }
            }
            if (slocValuesQuery.length > 0) {
                newFilterOpts.push(`(${slocValuesQuery.join(' or ')})`);
            }
        }

        if (materialNumber) {
            newFilterOpts.push(`MaterialNum eq '${materialNumber}'`);
        }

        if (materialDescription && !(context.binding['@odata.type'] === '#sap_mobile.BOMItem')) {
            newFilterOpts.push(`substringof('${materialDescription}', MaterialDesc)`);
        }
        materialLstPkrQueryOptions.filter(newFilterOpts.join(' and '));

        if (context.searchString) {
            if (onlineSwitchValue) {
                let searchString = context.searchString;
                let filters = [
                    `substringof('${searchString.toLowerCase()}', MaterialDesc)`,
                ];
                materialLstPkrQueryOptions.filter(`(${filters.join(' or ')})`);
            } else {
                let searchString = context.searchString;
                let filters = [
                    `substringof('${searchString.toLowerCase()}', tolower(Material/Description))`,
                    `substringof('${searchString.toLowerCase()}', tolower(Material/MaterialNum))`,
                ];
                materialLstPkrQueryOptions.filter(`(${filters.join(' or ')})`);
            }
        }

        return materialLstPkrQueryOptions;

    } catch (exc) {
        // If page is first loaded, attempts to get controls will fail
        let plant = context.getPageProxy().binding.Plant;
        let storageLoc = context.getPageProxy().binding.StorageLocation;
        if (plant && storageLoc) {
            return `$orderby=MaterialNum&$expand=Material,MaterialPlant&$filter=Plant eq '${plant}' and StorageLocation eq '${storageLoc}'`;
        } else if (plant) {
            return `$orderby=MaterialNum&$expand=Material,MaterialPlant&$filter=Plant eq '${plant}'`;
        } else {
            return '$orderby=MaterialNum&$expand=Material,MaterialPlant';
        }
    }
}
