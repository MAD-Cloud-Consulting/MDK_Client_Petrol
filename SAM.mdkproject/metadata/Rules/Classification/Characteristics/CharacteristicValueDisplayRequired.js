
export default function CharacteristicValueDisplayRequired(context) {
    let binding = context.binding;

    if (binding.Characteristic.EntryRequired === 'X') {
        return context.localizeText('yes');
    } else {
        return context.localizeText('no');
    }
    
}
