import Result from "../models/resultModel.js";

export async function createResult(req, res) {
  try {
    // auth
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const { title, technology, level, totalQuestions, correct, wrong } = req.body;

    // basic validation for required fields needed for create or update
    if (!technology || !level || totalQuestions === undefined || correct === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: technology, level, totalQuestions, correct"
      });
    }

    // compute wrong if not provided
    const computedWrong = wrong !== undefined ? Number(wrong) : Math.max(0, Number(totalQuestions) - Number(correct));

    // No existing -> create new document
    if (!title) {
      // require title when creating a new result
      return res.status(400).json({
        success: false,
        message: "Missing required field for creation: title"
      });
    }

    const payload = {
      title: String(title).trim(),
      technology,
      level,
      totalQuestions: Number(totalQuestions),
      correct: Number(correct),
      wrong: computedWrong,
      user: req.user.id
    };

    const created = await Result.create(payload);
    return res.status(201).json({ success: true, message: "Result created", result: created });

  } catch (err) {
    console.error("createResult error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function listResults(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const { technology } = req.query;

    // base query: only this user's results
    const query = { user: req.user.id };

    // If technology is provided and not "all", filter by it
    if (technology && technology.toLowerCase() !== "all") {
      query.technology = technology;
    }

    const items = await Result.find(query).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, results: items });
  } catch (err) {
    console.error("listResults error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
