import Logger from '../../Log/Logger';

export default function UpdateMap(context, pageName) {
    try {
        let pageProxy = context.evaluateTargetPathForAPI('#Page:' + pageName);
        let control = pageProxy.getControls()[0];
        control._control.update();
    } catch (err) {
        Logger.error('Sync', err.message);
    }
}
