import mongoose from "mongoose";






const userSavedRecipientsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipients: {
    type: [
      {
        recipientName: { type: String, required: true },
        iban: { type: String, required: true },
        currency: { type: String , required: true }
      },
    ],
    default: [],
  },
});


userSavedRecipientsSchema.index({ userId: 1, "recipients.iban": 1 });

const UserSavedRecipients = mongoose.model("UserSavedRecipients", userSavedRecipientsSchema);

export default UserSavedRecipients;
