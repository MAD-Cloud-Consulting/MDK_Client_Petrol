
export default function ProgressTrackerOnDataChanged(context) {
    let pageProxy = context.getPageProxy();

    if (pageProxy && pageProxy.currentPage._id === pageProxy._page._id) {
        let extension = pageProxy.getControl('SectionedTable')
            .getControl('ProgressTrackerExtensionControl')._control._extension;
        if (extension) {
            extension.reset();
        }
    }
}
