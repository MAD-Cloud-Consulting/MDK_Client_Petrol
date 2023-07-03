import LAMMultipleValuesList from './LAMMultipleValuesList';

export default function LAMMultipleValuesSelectionVisible(context) {
    return LAMMultipleValuesList(context).then(result => {
        return result.length > 1;
    });
}
