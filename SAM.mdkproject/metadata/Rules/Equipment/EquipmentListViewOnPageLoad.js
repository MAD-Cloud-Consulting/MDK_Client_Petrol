import Logger from '../Log/Logger';
import filter from './OnEquipmentFilterSuccess';

export default function EquipmentListViewOnPageLoad(context) {
    filter(context);
    Logger.info(context.localizeText('EQUIPMENT'), 'EquipmentListViewOnPageLoad called');
}
