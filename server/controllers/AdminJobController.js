const AdminJob = require("../models/AdminJobModel");
const cloudinary = require("../config/cloudinary"); // Update path as needed
const streamifier = require("streamifier");

const postJobByAdmin = async (req, res) => {
  try {
    const {
      jobTitle,
      companyName,
      location,
      jobType,
      salary,
      description,
      requirements,
      deadline,
    } = req.body;

    if (!jobTitle || !companyName || !location || !jobType || !description || !requirements || !deadline) {
      return res.status(400).json({ status: 0, msg: "Required fields missing" });
    }

    let logoUrl = null;

    if (req.file) {
      // Upload image buffer to Cloudinary
      const uploadFromBuffer = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "job_logos" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      logoUrl = await uploadFromBuffer();
    }

    const newJob = new AdminJob({
      jobTitle,
      companyName,
      location,
      jobType,
      salary,
      description,
      requirements,
      deadline,
      logo: logoUrl,
      postedByAdmin: req.admin._id,
    });

    await newJob.save();

    res.status(201).json({ status: 1, msg: "Job posted successfully", job: newJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, msg: "Server error", error: err.message });
  }
};


const getJobsPostedByAdmin = async (req, res) => {
  try {
    const jobs = await AdminJob.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 1, jobs });
  } catch (err) {
    res.status(500).json({ status: 0, msg: "Server error", error: err.message });
  }
};

const deleteJobByAdmin = async (req, res) => {
  try {
    const job = await AdminJob.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ status: 0, msg: "Job not found" });
    }

    // Ensure admin owns this job
    if (job.postedByAdmin.toString() !== req.admin._id.toString()) {
      return res.status(403).json({ status: 0, msg: "Not authorized" });
    }

    await job.deleteOne();
    res.status(200).json({ status: 1, msg: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: 0, msg: "Server error", error: err.message });
  }
};

module.exports = {
  postJobByAdmin,
  getJobsPostedByAdmin,
  deleteJobByAdmin
};
