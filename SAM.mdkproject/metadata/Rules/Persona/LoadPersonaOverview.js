/**
* Describe this function...
* @param {IClientAPI} context
*/
import libPersona from './PersonaLibrary';
import Logger from '../Log/Logger';

export default function LoadPersonaOverview(context) {
    let activePersona = libPersona.getActivePersona(context);
    if (activePersona === 'MAINTENANCE_TECHNICIAN') {
        return setPersonaMenuItem(context, 'OverviewMT');
    } else if (activePersona === 'INVENTORY_CLERK') {
        return setPersonaMenuItem(context, 'OverviewIC');
    } else if (activePersona === 'FIELD_SERVICE_TECHNICIAN') {
        return setPersonaMenuItem(context, 'OverviewST');
    } else {
        Logger.error('Persona', 'Invalid persona: ' + activePersona + ', cannot load persona based overview page');
    }
}

function setPersonaMenuItem(context, itemName) {
    let sleepTime = 750;
    Logger.info('Start redraw for ' + itemName);
    return context.getGlobalSideDrawerControlProxy().redraw().then(() => {
        return sleep(sleepTime).then(() => {
            context.getGlobalSideDrawerControlProxy().setSelectedMenuItemByName(itemName);
            return sleep(sleepTime).then(() => {
                Logger.info('Done redraw for ' + itemName);
                return Promise.resolve();
            });
            // return context.getGlobalSideDrawerControlProxy().setSelectedMenuItemByName(itemName).then(() => {
            //     return sleep(sleepTime).then(() => {
            //         Logger.info('Done redraw for ' + itemName);
            //         return Promise.resolve();
            //     });
            // });
        });
    });
}

function sleep(ms) {
    return (new Promise((resolve) => {
        Logger.info('Sleeping for ' + ms);
        setTimeout(function() {
            Logger.info('Done sleeping for ' + ms);
            resolve();
        }, ms);
    }));
}
