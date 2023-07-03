import GetMaterialName from '../../Common/GetMaterialName';

export default function InboundOutboundDeliveryTitle(context) {
    return GetMaterialName(context).then(name => {
        const material = context.binding.Material;
        if (name && material) {
            return material + ' - ' + name;
        } else if (name) {
            return name;
        } else if (material) {
            return material;
        }

        return '';
    });
}

