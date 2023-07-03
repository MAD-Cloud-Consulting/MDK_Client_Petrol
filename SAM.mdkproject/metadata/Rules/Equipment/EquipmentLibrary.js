import libCom from '../Common/Library/CommonLibrary';
import libForm from '../Common/Library/FormatLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import { EquipmentLibrary as equipmentLib } from './EquipmentLibrary';
import Logger from '../Log/Logger';


/**
 * Library class to hold all the business logic for equipment.
 */
export class EquipmentLibrary {

    /**
     * Query options for the MyEquipments entityset shown on the equipment list view page.
     */
    static equipmentListViewQueryOptions() {
        return '$select=ObjectStatus_Nav/SystemStatus_Nav/StatusText,WorkOrderHeader/OrderId,EquipDesc,EquipId,PlanningPlant,WorkCenter' +
               '&$orderby=EquipId' +
               '&$expand=ObjectStatus_Nav/SystemStatus_Nav,EquipDocuments,WorkOrderHeader,WorkCenter_Main_Nav';
    }

    /**
     * Query options for the MyEquipments entityset shown on the equipment details page
     */
    static equipmentDetailsQueryOptions() {
        return '$select=ObjectStatus_Nav/SystemStatus_Nav/StatusText,WorkOrderHeader/OrderId,' +
               'EquipDesc,EquipId,PlanningPlant,WorkCenter,EquipType,EquipCategory,FuncLocId','Room','PlantSection','InventoryNum','ManufSerialNo','ManufPartNo','ModelNum','Manufacturer','SuperiorEquip'+
               '&$orderby=EquipId' +
               '&$expand=ObjectStatus_Nav/SystemStatus_Nav,EquipDocuments,WorkOrderHeader,FunctionalLocation,WorkCenter_Main_Nav,SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav';
    }

     /**
     * Query options for the MyEquipments entityset shown on the equipment details page
     */
    static equipmentDetailsWithAssetCentralQueryOptions() {
        return '$select=ObjectStatus_Nav/SystemStatus_Nav/StatusText,WorkOrderHeader/OrderId,AssetCentralObjectLink_Nav/AINObjectId,' +
               'EquipDesc,EquipId,PlanningPlant,WorkCenter,EquipType,EquipCategory,FuncLocId','Room','PlantSection','InventoryNum','ManufSerialNo','ManufPartNo','ModelNum','Manufacturer','SuperiorEquip'+
               '&$orderby=EquipId' +
               '&$expand=ObjectStatus_Nav/SystemStatus_Nav,EquipDocuments,WorkOrderHeader,FunctionalLocation,WorkCenter_Main_Nav,AssetCentralObjectLink_Nav,AssetCentralIndicators_Nav,SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav';
    }

    /**
     * Gets a string that has the equipment plant description and the work center.
     * @param context The PageProxy object.
     * @return String formatted as "<plant description> (<plant number>), <work center number>
     */
    static getPlantAndWorkCenterDescString(context) {
        let equipment = equipmentLib.getEquipmentObjectFromContext(context);
        let overviewClientData = libCom.getClientDataForPage(context);
        let plantDescription = '';
        let externalWorkCenterId = '';
        if (overviewClientData.Plants && equipment.PlanningPlant && overviewClientData.Plants[equipment.PlanningPlant]) {
            plantDescription = overviewClientData.Plants[equipment.PlanningPlant].PlantDescription;
        }
        if (overviewClientData.WorkCenters && equipment.WorkCenter && overviewClientData.WorkCenters[equipment.WorkCenter]) {
            externalWorkCenterId = overviewClientData.WorkCenters[equipment.WorkCenter].ExternalWorkCenterId;
        }
        return equipmentLib.formatPlantAndWorkCenterDescString(context, equipment, plantDescription, externalWorkCenterId);
    }
    /**
     * Gets a string that has the plant description and the plant number.
     * @param context The PageProxy object.
     * @return String formatted as "<plant number> - <plant description>
     */
    static getPlantNumberAndDescription(context) {
        let equipment = equipmentLib.getEquipmentObjectFromContext(context);
        let overviewClientData = libCom.getClientDataForPage(context);
        let plantDescription = '';
        if (overviewClientData.Plants && equipment.PlanningPlant && overviewClientData.Plants[equipment.PlanningPlant]) {
            plantDescription = overviewClientData.Plants[equipment.PlanningPlant].PlantDescription;
        }
        return libForm.getFormattedKeyDescriptionPair(context, equipment.PlanningPlant, plantDescription);
    }
    /**
     * Simple function that returns a formatted Sting which has the equipment plant, plant description, work center and work center description.
     * @param equipment The Equipment object bound to the context
     * @param plantData Plant description
     * @param workCenterData External work center ID
     * @return String formatted as "<plant description> (<plant number>), <work center number>
     */
    static formatPlantAndWorkCenterDescString(context, equipment, plantData, workCenterData) {
        var returnString = '';
        if (!libVal.evalIsEmpty(plantData)) {
            returnString = libForm.getFormattedKeyDescriptionPair(context, equipment.PlanningPlant, plantData);
            if (!libVal.evalIsEmpty(equipment.WorkCenter)) {
                if (!libVal.evalIsEmpty(workCenterData)) {
                    returnString += ', ' + workCenterData;
                } else {
                    returnString += ', ' + equipment.WorkCenter;
                }
            }
        }
        return returnString;
    }

    /**
     * Rule used to display the various properties on the equipment detail view object header section.
     * @param context The PageProxy object.
     */
    static equipmentDetailViewFormat(context) {
        var section = context.getName();
        var property = context.getProperty();
        let equipment = equipmentLib.getEquipmentObjectFromContext(context);
        var value = '';

        switch (section) {
            case 'EquipmentObjectHeaderSection':
                switch (property) {
                    case 'SubstatusText':
                        //Display equipment status text.
                        value = equipmentLib.getStatusDescription(context, false);
                        break;
                    case 'Subhead':
                        //Display equipment type with type description
                        value = equipment.EquipType;
                        break;
                    case 'BodyText':
                        //Display functional location description
                        value = equipmentLib.getFunctionalLocationDescWithIdFormat(context);
                        break;
                    case 'Footnote':
                        //Display equipment category with category description
                        value = equipment.EquipCategory;
                        break;
                    case 'HeadlineText':
                        value = equipment.EquipDesc;
                        break;
                    default:
                        return '';
                }
                break;
            default:
                break;
        }
        return value;
    }

    /**
     * Gets the functional location description of a given equipment object bound in the context parameter.
     * @param context The PageProxy object.
     * @param funcLocId Optional. The functional location ID for which you want the description.
     * @returns Either the functional location description or a blank string if description is not found.
     */
    static getFunctionalLocationDescWithIdFormat(context) {
        let funcLoc = equipmentLib.getEquipmentObjectFromContext(context).FunctionalLocation;
        if (libVal.evalIsEmpty(funcLoc)) {
            return '';
        } else {
            return libForm.getFormattedKeyDescriptionPair(context,funcLoc.FuncLocId,funcLoc.FuncLocDesc);
        }
    }

    /**
     * Gets the description of a given equipment ID. The return format is "<Equipment Desc> (<Equipment ID>)".
     * @param context The context proxy object.
     * @param equipmentID. The equipment ID for which you want the description.
     * @returns {String} A formatted string that contains the equipment description or just the equipment ID if description was not found.
     */
    static getEquipmentDescriptionWithIdFormat(context, equipmentID) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', [],
            "$select=EquipDesc&$filter=EquipId eq '" + equipmentID + "'").then(
            equipmentData => {
                if (!libVal.evalIsEmpty(equipmentData)) {
                    if (!libVal.evalIsEmpty(equipmentData.getItem(0).EquipDesc)) {
                        return libForm.getFormattedKeyDescriptionPair(context, equipmentID, equipmentData.getItem(0).EquipDesc);
                    }
                }
                return equipmentID;
            },
            err => {
                /**Implementing our Logger class*/
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryEquipment.global').getValue(), `EquipmentLibrary.getEquipmentDescriptionWithIdFormat() error: ${err}`);
                return equipmentID;
            });
    }

    /**
     * Gets the description of the equipment status.
     * @param {*} context The SectionProxy object.
     * @return The description of the equipment status or blank if none is found.
     */
    static getStatusDescription(context, abbreviated) {
        let equipment = equipmentLib.getEquipmentObjectFromContext(context);
        var substatusText = ' ';
        var objectStatusesArray = equipment.ObjectStatus_Nav.SystemStatus_Nav;
        if (!libVal.evalIsEmpty(objectStatusesArray)) {
            if (abbreviated) {
                substatusText = objectStatusesArray.StatusTextShort;
            } else {
                substatusText = objectStatusesArray.StatusText;
            }
        }
        return substatusText;
    }

    /**
     * Find the Equipment object from context
     * @param {*} context Could be SectionProxy, PageProxy, etc.
     * @return Equipment object or undefined if nothing found.
     */
    static getEquipmentObjectFromContext(context) {
        var equipment = context.binding;
        if (libCom.isDefined(equipment.EquipId)) {
            return equipment;
        }
        equipment = context.getPageProxy().binding;
        if (libCom.isDefined(equipment.EquipId)) {
            return equipment;
        }
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryEquipment.global').getValue(), 'EquipmentLibrary.getEquipmentObjectFromContext() Error: Could not find equipment object from context');
        return undefined;
    }

    static equipmentDetailsOnPageLoad(context) {
        let equipment = equipmentLib.getEquipmentObjectFromContext(context);
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [],
            "$select=OrderId&$filter=HeaderEquipment eq '" + equipment.EquipId + "'").then(
            woData => {
                let woNumber = woData.getItem(0).OrderId;
                equipment.referenceWorkOrderForHistory = woNumber;
                return woNumber;
            }, err => {
                /**Implementing our Logger class*/
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryEquipment.global').getValue(), `EquipmentLibrary.equipmentDetailsOnPageLoad() Error: ${err}`);
                return undefined;
            });
    }
}
