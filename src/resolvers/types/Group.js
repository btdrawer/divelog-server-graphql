const UserModel = require("../../models/UserModel");

const getParticipants = ({ participants }) =>
  UserModel.find({
    _id: {
      $in: participants
    }
  });

module.exports = {
  participants: getParticipants,
  messages: async ({ participants, messages }) => {
    const participantsDetails = await getParticipants({ participants });
    const participantsDetailsReduced = await participantsDetails.reduce(
      (acc, participant) => ({
        ...acc,
        [participant.id]: participant
      }),
      {}
    );
    return messages.map(({ id, text, sender }) => ({
      id,
      text,
      sender: participantsDetailsReduced[sender]
    }));
  }
};
