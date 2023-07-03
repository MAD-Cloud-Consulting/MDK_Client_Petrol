import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import GeometryFromMap from '../../Geometries/GeometryFromMap';
import GeometryEditSessionId from '../../Geometries/GeometryEditSessionId';
import FunctionalLocationCreateUpdateGeometryPost from './FunctionalLocationCreateUpdateGeometryPost';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';

export default function FunctionalLocationCreateUpdateGeometryPre(context) {
    let geometry = GeometryFromMap(context);
    if (geometry && !libVal.evalIsEmpty(geometry.geometryValue)) {
        ApplicationSettings.setString(context,'Geometry', JSON.stringify(geometry));
    }

    if (context.getPageProxy().currentPage.id === 'MapExtensionControlPage' ||
        context.getPageProxy().currentPage.id === 'SideMenuMapExtensionControlPage' ||
        context.getPageProxy().currentPage.id === 'FunctionalLocationListViewPage') {
        return FunctionalLocationCreateUpdateGeometryPost(context);
    }

    libCommon.setStateVariable(context, 'GeometryObjectType', 'FunctionalLocation');

    let locTitle = context.evaluateTargetPath('#Page:FunctionalLocationCreateUpdatePage/#Control:LocationEditTitle');
    let formCell = context.evaluateTargetPath('#Page:FunctionalLocationCreateUpdatePage/#Control:FormCellContainer');
    let value = JSON.parse(geometry.geometryValue);
    if (geometry.geometryType === 'POINT') {
        locTitle.setValue(context.localizeText(geometry.geometryType.toLowerCase()) +': ' +
            value.y.toFixed(7) + ',' + value.x.toFixed(7));
    } else {
        locTitle.setValue(context.localizeText(geometry.geometryType.toLowerCase()) +': ' + GeometryEditSessionId());        
    }
    formCell.redraw();
}
