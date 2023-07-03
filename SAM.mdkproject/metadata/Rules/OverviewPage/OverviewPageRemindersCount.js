import { WorkOrderLibrary as WoLib } from '../WorkOrders/WorkOrderLibrary';
import ComLib from '../Common/Library/CommonLibrary';

export default function OverviewPageRemindersCount(pageClientAPI) {
    return ComLib.getEntitySetCount(pageClientAPI, 'UserPreferences', WoLib.getRemindersQueryOptionsFilter());
}
