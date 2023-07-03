export default function StyleFormCellButton(pageProxy, buttonName, colorClass = 'ObjectCellStyleRed') {
    const formCellContainerProxy = pageProxy.getControl('FormCellContainer');
    const button = formCellContainerProxy.getControl(buttonName);
    if (button) {
        button.setStyle(colorClass, 'Value');
        formCellContainerProxy.redraw();
    }

}
