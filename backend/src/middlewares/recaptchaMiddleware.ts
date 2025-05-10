import axios from "axios";
import { NextFunction, Request,Response ,} from "express";

const verifyRecaptcha = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
  const { recaptchaToken } = req.body;
  if (!recaptchaToken) {
    res.status(400).json({ message: "reCAPTCHA token is required" });
    return
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    console.log('secret key ',secretKey)
    if (!secretKey) {
      res.status(500).json({ message: "Missing reCAPTCHA secret key" });
      return
    }
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: recaptchaToken,
        },
      }
    )
    console.log("response",response.data)

    if (!response.data.success) {
       res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

    next();
  } catch (error) {
    // return res.status(500).json({ message: "Error verifying reCAPTCHA" });
    next(error)
  }
};

export default verifyRecaptcha
