import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Vendor from '../models/vendorModel.js'; 
import bcrypt from 'bcryptjs';
import { generateToken, isAuth } from '../utils.js';

const vendorRouter = express.Router();

vendorRouter.get('/seed', async (req, res) => {
  // Assuming you have a vendors array for seeding
  const createdVendors = await Vendor.insertMany(vendors);
  res.send({ createdVendors });
});

vendorRouter.post(
  '/vendorsignin',
  expressAsyncHandler(async (req, res) => {
    const vendor = await Vendor.findOne({ email: req.body.email });

    if (vendor) {
      if (bcrypt.compareSync(req.body.password, vendor.password)) {
        res.send({
          _id: vendor._id,
          name: vendor.name,
          email: vendor.email,
          isAdmin: vendor.isAdmin,
          token: generateToken(vendor),
        });
        return;
      }
    }

    res.status(401).send({ message: 'Invalid email or password.' });
  })
);

vendorRouter.post(
  '/registerVendor',
  expressAsyncHandler(async (req, res) => {
    const vendor = new Vendor({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      // Add more fields based on your vendor registration form
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      shopName: req.body.shopName,
      shopAddress: req.body.shopAddress,
      businessTypes: req.body.businessTypes,
    });

    const createdVendor = await vendor.save();
    res.send({
      _id: createdVendor._id,
      name: createdVendor.name,
      email: createdVendor.email,
      isAdmin: createdVendor.isAdmin,
      token: generateToken(createdVendor),
    });
  })
);

vendorRouter.get('/:id', expressAsyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);

  if (vendor) {
    res.send(vendor);
  } else {
    res.status(404).send({
      message: 'Vendor not found',
    });
  }
}));

export default vendorRouter;
