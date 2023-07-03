export default function ReferenceItems(context) {
    let objects = [
        {
            'ReturnValue': 'CLASSIFICATIONS_TO_COPY',
            'DisplayValue': context.localizeText('classifications'),
        },
        {
            'ReturnValue': 'MEASURING_POINTS_TO_COPY',
            'DisplayValue': context.localizeText('measuring_points'),
        },
        {
            'ReturnValue': 'PARTNERS_TO_COPY',
            'DisplayValue': context.localizeText('business_partners'),
        },
        {
            'ReturnValue': 'DOCUMENT_TO_COPY',
            'DisplayValue': context.localizeText('documents'),
        },
        {
            'ReturnValue': 'INSTALL_LOCATION_TO_COPY',
            'DisplayValue': context.localizeText('install_location'),
        },
        {
            'ReturnValue': 'CLASSIFICATION_VALUES_TO_COPY',
            'DisplayValue': context.localizeText('classification_values'),
        },
        {
            'ReturnValue': 'NOTE_TO_COPY',
            'DisplayValue': context.localizeText('note'),
        },
    ];

    return objects;
}
