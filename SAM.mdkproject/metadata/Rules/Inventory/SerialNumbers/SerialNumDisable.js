export default function SerialNumDisable(context, quantity) {
    const serialPicker = context.getPageProxy().getControl('SectionedTable').getControl('SerialNum');

    if (quantity) {
        serialPicker.setEditable(true);
    } else {
        serialPicker.setEditable(false);
    }
}
