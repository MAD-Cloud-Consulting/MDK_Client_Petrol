import EquipEntity from '../../EquipmentEntitySet';


export default async function CreateFromItems(context) {
    let createFrom = [
        {
            'ReturnValue': 'TEMPLATE',
            'DisplayValue': context.localizeText('template'),
        },
    ];
    let entitySet = EquipEntity(context);
    let queryOption = '$filter=sap.islocal()';

    let count = await context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, queryOption);

    if (count > 0) {
        createFrom.push(
            {
                'ReturnValue': 'PREVIOUSLY_CREATED',
                'DisplayValue': context.localizeText('previously_created'),
            }
        );
    } 

    return createFrom;
}
