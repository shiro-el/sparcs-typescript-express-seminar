import express from "express";
import feedStore from "../modules/feedStore";
import loggerMiddleware from "../middlewares/logger";
import { z } from "zod";

const router = express.Router();
router.use(loggerMiddleware)

const api002Schema = z.object({
  title: z.string(),
  content: z.string(),
})

const api003Schema = z.object({
  id: z.string(),
})

const api004Schema = z.object({
  id: z.string(),
  newTitle: z.string(),
  newContent: z.string(),
})

router.get("/getFeed", (req, res) => {
  try {
    const requestCount = parseInt(req.query.count as string, 10);
    const storeRes = feedStore.selectItems(requestCount);
    if (storeRes.success) {
      res.json(storeRes.data);
    } else {
      res.status(400).json(storeRes.data);
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/addFeed", (req, res) => {
  try {
    const { title, content } =  api002Schema.parse(req.body);
    const storeRes = feedStore.insertItem({ title, content });
    if (storeRes) {
      res.json({ isOK: true });
    } else {
      res.status(500).json({ isOK: false });
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/deleteFeed", (req, res) => {
  try {
    const { id } = api003Schema.parse(req.body);
    const storeRes = feedStore.deleteItem(parseInt(id as string, 10));
    if (storeRes) {
      res.json({ isOK: true });
    } else {
      res.status(500).json({ isOK: false });
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/editFeed", (req, res) => {
  try {
    const { id, newTitle, newContent } = api004Schema.parse(req.body);
    const storeRes = feedStore.editItem( parseInt(id as string, 10), newTitle, newContent );
    if (storeRes) {
      res.json({ isOK: true });
    } else {
    res.status(500).json({ isOK: false });
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

export default router;
