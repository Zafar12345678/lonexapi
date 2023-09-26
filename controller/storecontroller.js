const Store = require("../models/storemodel");
const User = require("../models/userModel");


const create_store = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.body.vendor_id });
    if (userData) {
      if (!req.body.latitude || !req.body.longitude) {
        return res.status(400).json({
          success: false,
          message: "Latitude and longitude are required.",
        });
      } else {
        const vendorData = await Store.findOne({ vendor_id: req.body.vendor_id });
        if (vendorData) {
          return res.status(400).json({
            success: false,
            message: "This vendor has already created a store.",
          });
        } else {
          const newStore = new Store({
            vendor_id: req.body.vendor_id,
            logo: req.file.filename,
            business_email: req.body.business_email,
            address: req.body.address,
            pin: req.body.pin,
            location: {
              type: "Point",
              coordinates: [
                parseFloat(req.body.longitude),
                parseFloat(req.body.latitude),
              ],
            },
          });

          const savedStore = await newStore.save();
          return res.status(200).json({
            success: true,
            message: "Store created successfully.",
            data: savedStore,
          });
        }
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Vendor ID does not exist.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  create_store,
};
