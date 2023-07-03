import GenerateLocalID from '../Common/GenerateLocalID';

export default function DocumentTransactionID(context) {
    return GenerateLocalID(context, 'Documents', 'ObjectKey', '00000','', '', 'ObjectKey').then(LocalId => {
        return LocalId;
    });
}
   
