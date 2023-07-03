import libCom from '../../Common/Library/CommonLibrary';

export default function noteFieldCaption(context) {
    if (libCom.getStateVariable(context, 'SupervisorNote')) {
        libCom.removeStateVariable(context, 'SupervisorNote');
        return '$(L,tech_note_caption)';
    }
    return '$(L,note)';
}
