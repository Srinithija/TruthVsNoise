const Claim = require("../models/Claim");

exports.createClaim = async (req, res) => {
  try {
    const { title, description, domain, attachments } = req.body;

    if (!title || !description || !domain) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newClaim = await Claim.create({
      title,
      description,
      domain,
      author: req.user._id,
      attachments: attachments || []
    });

    res.status(201).json({
      message: "Claim submitted successfully",
      claim: newClaim
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.listClaims = async (req, res) => {
    try {
        const claims = await Claim.find().populate("author", "name email");
        res.status(200).json(claims);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getClaim = async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.id).populate("author", "name email");
        if (!claim) {
            return res.status(404).json({ message: "Claim not found" });
        }
        res.status(200).json(claim);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
