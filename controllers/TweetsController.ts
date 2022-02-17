import express from "express";
import { validationResult } from "express-validator";

import { ITweetModel, TweetModel } from "../models/TweetModel";
import { isValidObjectId } from "../utils/isValidObjectId";
import { IUserModel } from "../models/UserModel";

class TweetsController {
  async index(_: any, res: express.Response): Promise<void> {
    try {
      const tweets = await TweetModel.find({})
        .populate("user")
        .sort({ createdAt: -1 })
        .exec();

      res.json({
        status: "success",
        data: tweets,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      });
    }
  }

  async show(req: express.Request, res: express.Response): Promise<void> {
    try {
      const tweetId = req.params.id;

      if (!isValidObjectId(tweetId)) {
        res.status(404).json({
          status: "error",
          message: "Некорректный Id твита",
        });
        return;
      }

      const tweet = await TweetModel.findById(tweetId).populate("user").exec();

      if (!tweet) {
        res.status(404).json({
          status: "error",
          message: "Твит не найден",
        });
        return;
      }

      res.json({
        status: "success",
        data: tweet,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      });
    }
  }

  async create(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user as IUserModel;

      if (user._id) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          res.status(400).json({
            status: "error",
            errors: errors.array(),
          });
          return;
        }

        const data: ITweetModel = {
          text: req.body.text,
          user,
        };

        const tweet = await TweetModel.create(data);

        res.json({
          status: "success",
          data: tweet,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      });
    }
  }

  async delete(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user as IUserModel;

      if (user) {
        const tweetId = req.params.id;

        if (!isValidObjectId(tweetId)) {
          res.status(404).json({
            status: "error",
            message: "Некорректный Id твита",
          });
          return;
        }

        const tweet = await TweetModel.findById(tweetId);

        if (tweet) {
          if (String(tweet.user._id) === String(user._id)) {
            tweet.remove();
            res.send();
          } else {
            res.status(403).json({
              status: "error",
              message: "Твит не принадлежит пользователю",
            });
          }
        } else {
          res.status(404).json({
            status: "error",
            message: "Твит не найден",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      });
    }
  }

  async update(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user as IUserModel;

      if (user) {
        const tweetId = req.params.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          res.status(400).json({
            status: "error",
            errors: errors.array(),
          });
          return;
        }

        if (!isValidObjectId(tweetId)) {
          res.status(404).json({
            status: "error",
            message: "Некорректный Id твита",
          });
          return;
        }

        const tweet = await TweetModel.findById(tweetId);

        if (tweet) {
          if (String(tweet.user._id) === String(user._id)) {
            const text = req.body.text;
            tweet.text = text;
            tweet.save();
            res.send();
          } else {
            res.status(403).json({
              status: "error",
              message: "Твит не принадлежит пользователю",
            });
          }
        } else {
          res.status(404).json({
            status: "error",
            message: "Твит не найден",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      });
    }
  }
}

export const TweetsCtrl = new TweetsController();
