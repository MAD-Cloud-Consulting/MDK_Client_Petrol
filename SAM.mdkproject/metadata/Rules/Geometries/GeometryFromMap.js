
export default function GeometryFromMap(context) {
    let type = '';
    let value = '';
    try {
        let extension = context.getControl('MapExtensionControl')._control;
        if (extension) {
            type = extension.getEditModeInfo().geometryType;
            value = extension.getEditModeInfo().geometryValue;
        }
    } catch (error) {
        if (context.getPageProxy().currentPage.editModeInfo) {
            type = context.getPageProxy().currentPage.editModeInfo.geometryType;
            value = context.getPageProxy().currentPage.editModeInfo.geometryValue;
        }
    }
    return {
        geometryType: type,
        geometryValue: value,
    };
}
