export default function EquipmentStatus(context) {
   return { name: 'ObjectStatus_Nav/SystemStatus_Nav/SystemStatus', values: [{ReturnValue: 'I0099', DisplayValue: context.localizeText('available')},{ReturnValue: 'I0100', DisplayValue: context.localizeText('installed')},{ReturnValue: 'I0116', DisplayValue: context.localizeText('allocated')}]};
}
