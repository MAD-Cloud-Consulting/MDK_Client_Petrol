import isDiscardAllErrorsButtonVisible from './IsDiscardAllErrorsButtonVisible';

export default function IsNotDiscardAllErrorsButtonVisible(context) {
    return isDiscardAllErrorsButtonVisible(context).then( (result)=> {
        return !result;
    });
}
