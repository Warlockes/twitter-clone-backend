import { body } from "express-validator";

export const registerValidations = [
  body("email", "Введите E-Mail").isEmail().withMessage("Неверный E-Mail"),

  body("fullname", "Введите имя")
    .isString()
    .isLength({ min: 2, max: 40 })
    .withMessage("Допустимое количество символов в имени от 2 до 40"),

  body("username", "Введите логин")
    .isString()
    .isLength({ min: 2, max: 40 })
    .withMessage("Допустимое количество символов в логине от 2 до 40"),

  body("password", "Введите пароль")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Минимальная длина пароля 6 символов")
    .custom((value, { req }) => {
      if (value !== req.body.confirmedPassword) {
        throw new Error("Пароли не совпадают");
      } else {
        return value;
      }
    }),
];
