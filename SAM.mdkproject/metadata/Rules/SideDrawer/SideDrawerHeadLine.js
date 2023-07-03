import libSuper from '../Supervisor/SupervisorLibrary';
import personalLib from '../Persona/PersonaLibrary';

export default function SideDrawerHeadLine(context) {
    
    if (personalLib.isMaintenanceTechnician(context)) {
        if (libSuper.isSupervisorFeatureEnabled(context)) {
            return libSuper.isUserSupervisor(context).then(isSupervisor => {
                if (isSupervisor) {
                    return context.localizeText('supervisor');
                }
                return context.localizeText('maintenance_technician');
            });
        }
        return context.localizeText('maintenance_technician');
    }
    if (personalLib.isInventoryClerk(context)) {
        return context.localizeText('inventory_clerk');
    }
    if (personalLib.isFieldServiceTechnician(context)) {
        return context.localizeText('field_service');
    }
    return Promise.resolve('');
}
