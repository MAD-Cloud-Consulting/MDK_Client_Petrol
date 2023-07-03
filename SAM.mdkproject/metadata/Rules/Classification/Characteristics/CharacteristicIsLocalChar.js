/**
 * Check if it's a local char
 * @param {*} context 
 */
export default function CharacteristicIsLocalChar(context) {
    return (context.binding['@odata.id'].split('(')[0] === 'ClassCharacteristics');
}
