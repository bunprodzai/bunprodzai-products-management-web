const Chat = require("../../models/chat.model");
const User = require("../../models/users.model");

// [GET] /carts
module.exports.index = async (req, res) => {
  const user_id = res.locals.user.id;
  _io.once('connection', (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      const chat = new Chat({
        user_id: user_id,
        content: content
      });
      await chat.save();

      // trả về cho client
      _io.emit("SERVER_RETURN_MESSAGE", {
        fullName: res.locals.user.fullName,
        userId: user_id,
        content: content
      });
    });
  });

  // lay data tu database in ra giao dien

  const chats = await Chat.find({ deleted: false });

  for (const chat of chats) {
    const inforUser = await User.findOne({ _id: chat.user_id }).select("fullName");
    chat.infoUser = inforUser;
  }
  // console.log(chats);

  // lay data tu database in ra giao dien

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats
  });
}