import { Request, Response } from "express";
import {
  getAll,
  getByHash,
  getByUrl,
  getCount,
  insertOne,
  updateUrl,
} from "../database";
import Joi = require("joi");

interface LooseObject {
  [key: string]: any;
}

class serviceController {
  db: LooseObject;

  constructor(db = {}) {
    this.db = db;
  }

  createUrl = async (req: Request, res: Response) => {
    try {
      const url = req.body.url;

      // check if already exists
      const existingUrl = await getByUrl(url);
      if (existingUrl && existingUrl.length > 0)
        return res.status(200).send(`Url already exists.`);

      // else create new
      let tmp = await getCount();
      tmp++;
      const hashVal: string = tmp.toString();
      await insertOne(hashVal, url);

      return res.status(200).send(`Url created with hashVal: ${hashVal}`);
    } catch (err) {
      const result = (err as Error).message;
      return res.status(500).send(`Server Error at createUrl: ${result}`);
    }
  };

  viewUrl = async (req: Request, res: Response) => {
    try {
      const hashVal = req.params["hashVal"];
      const result = await getByHash(hashVal);

      return res.status(200).send(result);
    } catch (err) {
      const result = (err as Error).message;
      return res.status(500).send(`Server Error at viewUrl: ${result}`);
    }
  };

  viewAll = async (req: Request, res: Response) => {
    try {
      const result = await getAll();
      return res.status(200).send(result);
    } catch (err) {
      const result = (err as Error).message;
      return res.status(500).send(`Server Error at viewAll: ${result}`);
    }
  };

  editUrl = async (req: Request, res: Response) => {
    try {
      const newUrl = req.body.newUrl;
      const oldUrl = req.body.oldUrl;

      await updateUrl(newUrl, oldUrl);
      return res.status(200).send(`Url updated`);
    } catch (err) {
      const result = (err as Error).message;
      return res.status(500).send(`Server Error at editUrl: ${result}`);
    }
  };
}

export const ServiceController = new serviceController();
