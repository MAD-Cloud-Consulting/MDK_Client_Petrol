export default function getTranslatedPersonaValue(context, userPersona) {
    let personasArray = [
        {
            userPersona: 'FIELD_SERVICE_TECHNICIAN',
            translatedPersonaName: context.localizeText('field_service'),
        },
        {
            userPersona: 'INVENTORY_CLERK',
            translatedPersonaName: context.localizeText('inventory_clerk'),
        },
        {
            userPersona: 'MAINTENANCE_TECHNICIAN',
            translatedPersonaName: context.localizeText('maintenance_technician'),
        },
    ];

    let currentPersona = personasArray.find(persona => persona.userPersona === userPersona);
    if (currentPersona) {
        return currentPersona.translatedPersonaName;
    }
    return '';
}
