
import IconUtils from './IconUtils';
import libPersona from '../../Persona/PersonaLibrary';

const icon = 'MarkerJobSelected';
const serviceOrder = 'ServiceOrderSelected';

export default function SelectedWorkOrderIcon(context) {
    const activePersona = libPersona.getActivePersona(context);
    if (activePersona === 'FIELD_SERVICE_TECHNICIAN') {
        return IconUtils.getIcon(context, serviceOrder);
    } else {
        return IconUtils.getIcon(context, icon);
    }
}
