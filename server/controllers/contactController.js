const User = require("../models/User");

const searchContacts = async (req, res) => {
  try {

    const { searchTerm } = req.body;
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "Search Term is required!",
      });
    }

    const sanitizedSearchTerm = searchTerm.replace(
      /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
      $and: [
        {
          _id: { $ne: req.userId }
        },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });

    return res.status(200).json({
      success : true,
      message : "Contact searched successfully !",
      contacts : contacts,
    });
  }
  catch (error) {
    return response.status(500).json({
      success: false,
      message: "Internal Server Error!!",
    })
  }
}

module.exports = {searchContacts}