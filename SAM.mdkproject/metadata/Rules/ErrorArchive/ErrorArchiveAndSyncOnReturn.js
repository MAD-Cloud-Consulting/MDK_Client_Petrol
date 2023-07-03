import sideDrawerErrorCount from '../SideDrawer/SideDrawerErrorCount';

export default function ErrorArchiveAndSyncOnReturn(context) {
    return sideDrawerErrorCount(context).then(result => {
        context.setCaption(result);
        return true;
    });
}
