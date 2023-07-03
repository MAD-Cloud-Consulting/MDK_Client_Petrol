import GenerateLocalID from '../../Common/GenerateLocalID';
export default function GenerateCommPropertySequenceNumber(context) {
    // Retrieve read link to communications set for generating a sequence number
    let commSetReadLink = context.getClientData().communicationsSetReadLink;
    return GenerateLocalID(context, commSetReadLink, 'SequenceNum', '000', '', '', 'SequenceNum');
}
