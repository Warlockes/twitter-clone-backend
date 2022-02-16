import { body } from "express-validator";

export const createTweetValidations = [
  body("text", "Введите текст твита")
    .isString()
    .isLength({
      min: 1,
      max: 280,
    })
    .withMessage(
      "Введите текст твита.\nМаксимальное количество символов - 280"
    ),
];
