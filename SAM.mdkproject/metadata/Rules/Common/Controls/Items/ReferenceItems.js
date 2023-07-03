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
            'ReturnValue': 'LONG_TEXT_TO_COPY',
            'DisplayValue': context.localizeText('long_text'),
        },
        {
            'ReturnValue': 'DOCUMENT_TO_COPY',
            'DisplayValue': context.localizeText('documents'),
        },
    ];

    return objects;
}
