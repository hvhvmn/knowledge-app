import itemsModel from "../models/items.model.js";
import { vectorSearchService, getVectorById } from "../services/aiService.js";

export const getGraphData = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await itemsModel.find({ userId }).lean();

    if (!items || items.length === 0) {
      return res.status(200).json({ nodes: [], links: [] });
    }

    const nodes = items.map(item => ({
      id: item._id.toString(),
      label: item.title,
      tags: item.tags,
      collectionId: item.collectionId ? item.collectionId.toString() : null
    }));

    const linkKey = (a, b) => (a < b ? `${a}~~~${b}` : `${b}~~~${a}`);
    const linkMap = new Map();

    // Same collection links
    const collectionGroups = new Map();
    items.forEach(item => {
      if (item.collectionId) {
        const coll = item.collectionId.toString();
        const arr = collectionGroups.get(coll) || [];
        arr.push(item._id.toString());
        collectionGroups.set(coll, arr);
      }
    });

    for (const group of collectionGroups.values()) {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          const key = linkKey(group[i], group[j]);
          const existing = linkMap.get(key) || { source: group[i], target: group[j], weight: 0, types: new Set() };
          existing.weight += 3;
          existing.types.add("collection");
          linkMap.set(key, existing);
        }
      }
    }

    // Tag similarity links
    const tagGroups = new Map();
    items.forEach(item => {
      (item.tags || []).forEach(tag => {
        const normalized = String(tag).trim().toLowerCase();
        if (!normalized) return;
        const arr = tagGroups.get(normalized) || [];
        arr.push(item._id.toString());
        tagGroups.set(normalized, arr);
      });
    });

    for (const group of tagGroups.values()) {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          const key = linkKey(group[i], group[j]);
          const existing = linkMap.get(key) || { source: group[i], target: group[j], weight: 0, types: new Set() };
          existing.weight += 1;
          existing.types.add("tag");
          linkMap.set(key, existing);
        }
      }
    }

    // Vector similarity: do one similarity query per item, with dedupe
    for (const item of items) {
      const itemVector = await getVectorById(item._id);
      if (!itemVector) continue;

      const neighbors = await vectorSearchService(itemVector, 6);
      neighbors.forEach(neighbor => {
        if (!neighbor.id || neighbor.id === item._id.toString()) return;
        const key = linkKey(item._id.toString(), neighbor.id);
        const existing = linkMap.get(key) || { source: item._id.toString(), target: neighbor.id, weight: 0, types: new Set() };
        existing.weight += 2;
        existing.types.add("vector");
        linkMap.set(key, existing);
      });
    }

    const links = Array.from(linkMap.values()).map(l => ({
      source: l.source,
      target: l.target,
      weight: l.weight,
      type: Array.from(l.types).join("|")
    }));

    return res.status(200).json({ nodes, links });
  } catch (error) {
    console.error("Graph API error:", error);
    return res.status(500).json({ message: "Could not generate graph", error: error.message });
  }
};
