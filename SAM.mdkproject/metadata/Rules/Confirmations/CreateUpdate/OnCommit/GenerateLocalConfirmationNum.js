import GenerateLocalID from '../../../Common/GenerateLocalID';

export default function GenerateLocalConfirmationNum(context, extraOffset=0) {
    
    return GenerateLocalID(context, 'Confirmations', 'ConfirmationNum', '0000000000', '', '', '', extraOffset);
}


