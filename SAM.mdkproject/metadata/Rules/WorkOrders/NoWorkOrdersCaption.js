import libPersona from '../Persona/PersonaLibrary';

export default function NoWorkOrdersCaption(context) {
    const isFST = libPersona.isFieldServiceTechnician(context);

    return isFST ? context.localizeText('no_serviceorders_available') : context.localizeText('no_workorders_available');
}
