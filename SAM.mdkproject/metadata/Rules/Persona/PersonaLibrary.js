import appSettings from '../Common/Library/ApplicationSettings';

export default class {
    /*
     * Checks if a persona is maintenance technicain
     */
    static isMaintenanceTechnician(context) {
        return (this.getActivePersona(context) === 'MAINTENANCE_TECHNICIAN');
    }

    /**
    * Checks if a persona is inventory clerk
    */
    static isInventoryClerk(context) {
        return (this.getActivePersona(context) === 'INVENTORY_CLERK');
    }

    /**
    * Checks if a persona is field service technicain
    */
    static isFieldServiceTechnician(context) {
        return (this.getActivePersona(context) === 'FIELD_SERVICE_TECHNICIAN');
    }

    /**
    * Returns a persona based overview page
    */
    static getPersonaOverviewPage(context) {
        if (this.isMaintenanceTechnician(context)) {
            return '/SAPAssetManager/Pages/Overview.page';
        } else if (this.isInventoryClerk(context)) {
            return '/SAPAssetManager/Pages/Inventory/InventoryOverview.page';
        } else if (this.isFieldServiceTechnician(context)) {
            return '/SAPAssetManager/Pages/FieldService/FieldServiceOverview.page';
        }
        //default is maintenance technician
        return '/SAPAssetManager/Pages/Overview.page';
    }

    /**
    * Returns the overview page name based on persona for storing state variables
    */
    static getPersonaOverviewStateVariablePage(context) {
        if (this.isMaintenanceTechnician(context)) {
            return context.getGlobalDefinition('/SAPAssetManager/Globals/DefaultMessages/DefaultStateVariablePage.global').getValue();
        } else if (this.isInventoryClerk(context)) {
            return context.getGlobalDefinition('/SAPAssetManager/Globals/DefaultMessages/DefaultStateVariablePageIMPersona.global').getValue();
        } else if (this.isFieldServiceTechnician(context)) {
            return context.getGlobalDefinition('/SAPAssetManager/Globals/DefaultMessages/DefaultStateVariablePageSTPersona.global').getValue();
        }
        //default is maintenance technician
        return context.getGlobalDefinition('/SAPAssetManager/Globals/DefaultMessages/DefaultStateVariablePage.global').getValue();
    }

    /**
    * Sets the active persona
    */
    static setActivePersona(context, activePersona) {
        appSettings.setString(context, 'ActivePersona', activePersona);
    }

    /**
    * Gets the active persona
    */
    static getActivePersona(context) {
        return appSettings.getString(context, 'ActivePersona');
    }

    /**
    * Initializes a default persona during initial sync
    * userPersonas: Results from reading UserPersonas entityset
    */
    static initializePersona(context, userPersonas) {
        let defaultPersona;
        if (userPersonas && userPersonas.length > 0) {
            appSettings.remove(context, 'PersonaCount');
            appSettings.setNumber(context, 'PersonaCount', userPersonas.length);
            for (let index = 0; index < userPersonas.length; index++) {
                let personaItem = userPersonas.getItem(index);
                if (personaItem.FlagDefault === 'X') {
                    defaultPersona = personaItem.UserPersona;
                }
                appSettings.remove(context, 'Persona-' + index);
                appSettings.setString(context, 'Persona-' + index, personaItem.UserPersona);
            }
            // Logger.info(`results: ${userPersonas.length}`);
        }
        if (appSettings.getNumber(context, 'PersonaCount') > 1) {
            if (defaultPersona) {
                this.setActivePersona(context, defaultPersona);
            } else if (userPersonas.some(persona => persona.UserPersona === 'MAINTENANCE_TECHNICIAN')) { // if there is MT among user's personas, set it as default
                this.setActivePersona(context, 'MAINTENANCE_TECHNICIAN');
            } else {
                this.setActivePersona(context, appSettings.getString(context, 'Persona-0')); // if no, just set the first one
            }
        } else {
            this.setActivePersona(context, appSettings.getString(context, 'Persona-0'));
        }
    }
}
