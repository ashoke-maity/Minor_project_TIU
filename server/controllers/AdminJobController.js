const mongoose = require('mongoose');
const AdminJob = require("../models/AdminJobModel");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// post job by admin
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
    let logoPublicId = null;

    if (req.file) {
      // Upload image buffer to Cloudinary
      const uploadFromBuffer = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "job_logos" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const uploadResult = await uploadFromBuffer();
      logoUrl = uploadResult.secure_url;
      logoPublicId = uploadResult.public_id;
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
      logoPublicId: logoPublicId || null,
      postedByAdmin: req.admin._id,
    });

    await newJob.save();

    res.status(201).json({ status: 1, msg: "Job posted successfully", job: newJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, msg: "Server error", error: err.message });
  }
};

// get all jobs posted by admin
const getJobsPostedByAdmin = async (req, res) => {
  try {
    // Populate postedByAdmin and return all job fields
    const jobs = await AdminJob.find()
      .sort({ createdAt: -1 })
      .populate('postedByAdmin', 'name email _id');
    res.status(200).json({ status: 1, jobs });
  } catch (err) {
    res.status(500).json({ status: 0, msg: "Server error", error: err.message });
  }
};

// edit job by admin
const EditJobsByAdmin = async (req,res) => {
  try{
    const { jobTitle, companyName, location, jobType, salary, description, requirements, deadline, logo } = req.body;

    if (!jobTitle || !companyName || !location || !jobType || !description || !requirements || !deadline) {
      return res.status(400).json({ status: 0, msg: "Required fields missing" });
    }

    const job = await AdminJob.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ status: 0, msg: "Job not found" });
    }

    // Ensure admin owns this job
    if (job.postedByAdmin.toString() !== req.admin._id.toString()) {
      return res.status(403).json({ status: 0, msg: "Not authorized" });
    }

    job.jobTitle = jobTitle;
    job.companyName = companyName;
    job.location = location;
    job.jobType = jobType;
    job.salary = salary;
    job.description = description;
    job.requirements = requirements;
    job.deadline = deadline;

    // Handle logo update
    if (req.file) {
      // Delete previous image from Cloudinary if exists and is a valid public ID
      if (job.logoPublicId && typeof job.logoPublicId === 'string' && job.logoPublicId.trim() !== '') {
        try {
          console.log('Deleting previous logo from Cloudinary:', job.logoPublicId);
          await cloudinary.uploader.destroy(job.logoPublicId);
        } catch (delErr) {
          console.warn('Failed to delete previous logo from Cloudinary:', delErr.message);
        }
      }
      // Upload new image buffer to Cloudinary
      const uploadFromBuffer = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "job_logos" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
      const uploadResult = await uploadFromBuffer();
      job.logo = uploadResult.secure_url;
      job.logoPublicId = uploadResult.public_id;
    } else if (logo !== undefined) {
      job.logo = logo;
      // Optionally, clear logoPublicId if logo is not a Cloudinary image
      // job.logoPublicId = null;
    }

    await job.save();

    res.status(200).json({ status: 1, msg: "Job updated successfully", job });
  }catch(error){
    console.log("Error in EditJobsByAdmin:", error);
    res.status(500).json({ status: 0, msg: "Server error", error: error.message });
  }
};

// delete job by admin
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

    // Delete logo from Cloudinary if it exists
    if (job.logoPublicId && typeof job.logoPublicId === 'string' && job.logoPublicId.trim() !== '') {
      try {
        await cloudinary.uploader.destroy(job.logoPublicId);
      } catch (err) {
        console.warn('Failed to delete logo from Cloudinary:', err.message);
      }
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
  EditJobsByAdmin,
  deleteJobByAdmin
};
