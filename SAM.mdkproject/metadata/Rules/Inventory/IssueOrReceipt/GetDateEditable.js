import enableItemsScreen from '../MaterialDocument/EnableItemsScreen';

export default function GetDateEditable(context) {
    let res = enableItemsScreen(context);
    return !res;
}
