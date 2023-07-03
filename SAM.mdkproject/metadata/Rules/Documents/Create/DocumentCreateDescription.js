
export default function DocumentCreateDescription(context) {
    if (context.getPageProxy().getControls().some(controls => controls.getName() === 'PDFExtensionControl')) {
        return 'Service Report';
    } else { 
        return context.getPageProxy().evaluateTargetPath('#Control:AttachmentDescription/#Value');
    }
}
