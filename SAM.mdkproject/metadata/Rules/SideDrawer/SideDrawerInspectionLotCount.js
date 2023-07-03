import count from '../WorkOrders/InspectionLot/InspectionLotCount';

export default function SideDrawerInspectionLotCount(context) {
    return count(context).then(result => {
        return context.localizeText('checklists_x', [result]);
    });
}

