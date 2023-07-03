import libCom from '../../Common/Library/CommonLibrary';

export default function GetDocumentCreateSuccessMessage(context) {
    let movementType = libCom.getStateVariable(context, 'IMMovementType');

    if (libCom.getStateVariable(context, 'IMObjectType') === 'TRF') { 
        return '$(L, mat_doc_transferred)';
    }

    if (movementType === 'R') { 
        return '$(L, mat_doc_received)';
    }

    if (movementType === 'I') { 
        return '$(L, mat_doc_issues)';
    }

    return '$(L, mat_doc_created)';
}
