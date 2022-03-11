import express from "express";
import cloudinary from "../core/cloudinary";

class UploadFileController {
  async upload(req: express.Request, res: express.Response) {
    if (req.file) {
      const file = req.file;

      cloudinary.uploader
        .upload_stream({ resourse_type: "auto" }, (error, result) => {
          if (error || !result) {
            return res.status(500).json({
              status: "error",
              message: error || "upload error",
            });
          }

          res.status(201).send();
        })
        .end(file.buffer);
    }
  }
}

export const UploadFileCtrl = new UploadFileController();
