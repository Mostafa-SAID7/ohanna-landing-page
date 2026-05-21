import type { Request, Response } from "express";
import { contactService } from "../services";

export const contactController = {
  async submit(req: Request, res: Response): Promise<void> {
    const result = await contactService.submit(req.body);
    res.json(result);
  },
};
