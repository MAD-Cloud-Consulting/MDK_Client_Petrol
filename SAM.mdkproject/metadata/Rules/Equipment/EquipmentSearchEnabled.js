import equipmentCount from './EquipmentCount';

export default function EquipmentSearchEnabled(context) {
    return equipmentCount(context).then(count => {
        return count !== 0;
    });
}
