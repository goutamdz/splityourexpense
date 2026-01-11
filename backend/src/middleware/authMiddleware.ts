import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    type Decoded = {
      id: number;
      email: string;
      name: string;
    };

    const decoded: Decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as Decoded;

    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default authMiddleware;
