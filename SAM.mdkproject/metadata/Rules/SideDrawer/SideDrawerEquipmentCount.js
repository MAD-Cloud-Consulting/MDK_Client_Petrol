import count from '../Equipment/EquipmentCount';

export default function SideDrawerEquipmentCount(context) {
    return count(context).then(result => {
        return context.localizeText('equipment_x', [result]);
    });
}
