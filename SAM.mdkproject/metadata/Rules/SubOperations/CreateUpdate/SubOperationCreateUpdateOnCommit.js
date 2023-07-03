import {SubOperationEventLibrary as libSubOpEvent} from '../SubOperationLibrary';

export default function SubOperationCreateUpdateOnCommit(pageProxy) {
    libSubOpEvent.createUpdateOnCommit(pageProxy);
}
