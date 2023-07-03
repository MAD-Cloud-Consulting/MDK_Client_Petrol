import GetStartDateTime from './GetStartDateTime';
import GetEndDateTime from './GetEndDateTime';
import GetPostingDate from './GetPostingDate';
import GetDuration from './GetDuration';
import ConfirmationDateBounds from '../../ConfirmationDateBounds';

/**
 *
 * @param {*} context
 */
export default function IsValidConfirmation(context) {


  let binding = context.getBindingObject();

  if (binding.OrderID.length === 0) {
    return false;
  }

  let now = new Date();
  let start = GetStartDateTime(context);

  // If trying to start in the future, not valid
  if (start > now) {
    return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationValidationInvalidStart.action').then(function() {
      return Promise.reject(false);
    });
  }


  let endDateTime = GetEndDateTime(context);
  if (endDateTime > now) {
    return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationValidationInvalidEnd.action').then(function() {
      return false;
    });
  }

  const PostingDate = GetPostingDate(context);
  const confirmedDateBounds = ConfirmationDateBounds(PostingDate);
  const lowerBound = confirmedDateBounds[0];
  const upperBound = confirmedDateBounds[1];
  const confirmationsPerConfirmedDateRequest = context.read(
      '/SAPAssetManager/Services/AssetManager.service',
      'Confirmations',
      [],
      `$filter=StartTimeStamp ge datetime'${lowerBound}' and StartTimeStamp le datetime'${upperBound}'`
  );

  return confirmationsPerConfirmedDateRequest
      .then(observableArray => {
        const totalDurationPerConfirmedDate = observableArray
            .map(item => item.ActualDuration)
            .reduce((acc, item) => {
              return acc + item;
            }, 0);
        const currentDuration = +GetDuration(context);
        if (currentDuration + totalDurationPerConfirmedDate > 1440) {
            return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationValidationInvalidTotalDuration.action').then(function() {
                return false;
              });
        } else {
          return true;
        }
      })
      .catch(function() {
        return false;
      });
}
