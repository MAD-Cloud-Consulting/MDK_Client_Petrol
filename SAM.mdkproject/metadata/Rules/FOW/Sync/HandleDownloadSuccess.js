import ClearRouteCache from './ClearRouteCache';
import UpdateOverviewMap from './UpdateOverviewMap';
import UpdateMap from './UpdateMap';

export default function HandleDownloadSuccess(context) {
    return ClearRouteCache(context).then(() => {
        UpdateOverviewMap(context);
        UpdateMap(context, 'MapExtensionControlPage');
        UpdateMap(context, 'SideMenuMapExtensionControlPage');
    });
}
