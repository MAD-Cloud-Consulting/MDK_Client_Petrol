import libCommon from '../Library/CommonLibrary';
import AssignmentType from '../../Common/Library/AssignmentType';
import Logger from '../../Log/Logger';

/**
 * After changeset success, reset the state variables
 */
export default function ChangeSetOnFailure(pageProxy) {
    libCommon.setOnCreateUpdateFlag(pageProxy, '');
    libCommon.setOnChangesetFlag(pageProxy, false);
    libCommon.setOnWOChangesetFlag(pageProxy, false);
    try {
        AssignmentType.removeWorkOrderDefaultOverride();
    } catch (error) {
        Logger.error('AssigmentType RemoveWorkOrderDeafultOverrride: ', error);
    }
}
