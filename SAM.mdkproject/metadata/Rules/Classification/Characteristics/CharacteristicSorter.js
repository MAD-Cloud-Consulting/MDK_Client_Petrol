export default function CharacteristicSorter(a,b) {
    return parseInt(a.ReturnValue.split('|')[1]) - parseInt(b.ReturnValue.split('|')[1]);
}
