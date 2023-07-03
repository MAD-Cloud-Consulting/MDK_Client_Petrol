
import Logger from '../Log/Logger';

export default function LocationUpdateOnFailure(context) {
    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryLocationTracking.global').getValue(),
        'Location Update got failed');
}
