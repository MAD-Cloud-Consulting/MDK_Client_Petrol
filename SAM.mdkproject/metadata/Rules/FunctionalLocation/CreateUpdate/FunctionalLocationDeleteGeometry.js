import GeometryDelete from '../../Geometries/GeometryDelete';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function FunctionalLocationDeleteGeometry(context) {
    return context.executeAction('/SAPAssetManager/Actions/DiscardWarningMessage.action').then( result => {
        if (result.data === true) {
            return GeometryDelete(context, 'Geometry_Nav', 'Geometries').then(() => {
                return GeometryDelete(context, 'FuncLocGeometries', 'MyFuncLocGeometries').then(() => {
                    if (context.getPageProxy()._page.id === 'MapExtensionControlPage' ||
                        context.getPageProxy()._page.id === 'SideMenuMapExtensionControlPage') {
                        return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessageNoClosePage.action');
                    }
                    return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessage.action');
                }).catch(() => {
                    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntityFailureMessage.action');
                });
            }).catch(() => {
                return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntityFailureMessage.action');
            });
        }
        return Promise.resolve();
    });
}
