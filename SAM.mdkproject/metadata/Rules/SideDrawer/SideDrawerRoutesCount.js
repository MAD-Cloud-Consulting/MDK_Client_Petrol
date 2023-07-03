export default function SideDrawerRoutesCount(sectionProxy, queryOption = '') {
    return sectionProxy.count('/SAPAssetManager/Services/AssetManager.service','MyRoutes', queryOption).then((count) => {
        return sectionProxy.localizeText('fow_routes_title_x', [count]);
    });
}
