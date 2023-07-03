import Logger from '../../Log/Logger';

export default function ClearRouteCache(context) {
    try {  
        let pageProxy = context.evaluateTargetPathForAPI('#Page:OverviewPage');
        let sectionedTable = pageProxy.getControls()[0];
        let mapSection = sectionedTable.getSections()[0];
        let mapViewExtension = mapSection.getExtensions()[0];
        mapViewExtension.clearRouteCache();
        return Promise.resolve(); 
    } catch (err) {  
        Logger.error('Sync', err.message);
        return Promise.resolve();
    }
}
