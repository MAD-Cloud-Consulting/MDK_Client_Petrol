import FunctionalLocationEntity from '../../../FunctionalLocation/FunctionalLocationEntitySet';

export default function CreateFromItems(context) {
    let createFrom = [
        {
            'ReturnValue': 'TEMPLATE',
            'DisplayValue': context.localizeText('template'),
        },
    ];
    let entitySet = FunctionalLocationEntity(context);
    let queryOption = '$filter=sap.islocal()';

    return context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, queryOption).then(count => {
        if (count > 0) {
            createFrom.push(
                {
                    'ReturnValue': 'PREVIOUSLY_CREATED',
                    'DisplayValue': context.localizeText('previously_created'),
                }
            );
        }

        return createFrom;
    });
}
