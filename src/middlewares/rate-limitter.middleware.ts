import {
  rateLimit,
  type RateLimitRequestHandler,
} from "express-rate-limit"
import { RATE_DELAY, RATE_LIMIT } from "@config/index";
import { HttpExceptionTooManyRequests } from "@/exceptions/HttpException";

class Limitter {
  public default = (): RateLimitRequestHandler => {
    const delay = Number(RATE_DELAY) * 60 * 1000; // 1 menit

    return rateLimit({
      windowMs: delay, 
      max: Number(RATE_LIMIT),
      keyGenerator: (req) => req.ip, 
      handler: () => {
        throw new HttpExceptionTooManyRequests(
          [`Too many requests from this IP, please try again after ${RATE_DELAY} minutes`],
        );
      },
    });
  };
  
  public emailVerification = (): RateLimitRequestHandler => {
    const delay = 60 * 60 * 1000; // 1 jam

    return rateLimit({
      windowMs: delay, 
      max: 5,
      keyGenerator: (req) => req.ip, 
      handler: () => {
        throw new HttpExceptionTooManyRequests(
          [`Too many requests from this IP, please try again after ${Math.ceil(delay / (60 * 1000))} minutes`],
        );
      },
    });
  };
}

export default Limitter;