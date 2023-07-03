
const highPrioritySuffix = 'HighPriority';

import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import libPersona from '../../Persona/PersonaLibrary';

export default class {

    /**
     * Returns true if priority indicates a high priority item
     * @param {String} priority 
     */
    static isHighPriority(priority) {
        return (priority === '1' || priority === '2');
    }

    /**
     * Returns the icon in 'High Priority' state
     * @param {String} icon 
     */
    static getHighPriorityIcon(icon) {
        return icon + highPrioritySuffix;
    }
    /**
     * Returns mobile status
     * @param {*} context 
     * @returns mobile status
     */
    static getMobileStatus(context) {
        return libMobile.getMobileStatus(context.binding, context);
    }
    /**
     * Returns correct icon name using mobile status
     * @param {*} context 
     * @param {*} icon 
     * @returns 
     */
    static getIconUsingMobileStatus(context, icon) {
        let mobileStatus =  this.getMobileStatus(context);
        let hold = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
        let completed = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        if (mobileStatus === hold) {
            return icon + 'OnHold';
        } else if (mobileStatus === completed) {
            return icon + 'Completed';
        } else {
            return icon;
        }
   
    }
    /**
     * Retrieve the appropriate icon based on 
     * @param {*} context 
     * @param {*} icon 
     */
    static getIcon(context, icon) {
        let priority = context.binding.Priority;
        const activePersona = libPersona.getActivePersona(context);
        if (activePersona === 'FIELD_SERVICE_TECHNICIAN') {
            icon = this.getIconUsingMobileStatus(context, icon);
        }
        if (this.isHighPriority(priority)) {
            return this.getHighPriorityIcon(icon);
        }
        return icon;
    }

}
