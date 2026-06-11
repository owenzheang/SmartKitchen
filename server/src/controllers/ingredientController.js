import database from "../database.js";

export function getIngredients(req, res) {
  const sql = `
    SELECT id, name, quantity, unit
    FROM ingredients
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  database.all(sql, [req.user.userId], (error, ingredients) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json(ingredients);
  });
}

export function addIngredient(req, res) {
  const { name, quantity, unit } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Ingredient name is required." });
  }

  const sql = `
    INSERT INTO ingredients (user_id, name, quantity, unit)
    VALUES (?, ?, ?, ?)
  `;

  database.run(sql, [req.user.userId, name, quantity, unit], function (error) {
    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.status(201).json({
      message: "Ingredient added.",
      ingredient: {
        id: this.lastID,
        name,
        quantity,
        unit
      }
    });
  });
}

export function updateIngredient(req, res) {
  const { id } = req.params;
  const { name, quantity, unit } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Ingredient name is required." });
  }

  const sql = `
    UPDATE ingredients
    SET name = ?, quantity = ?, unit = ?
    WHERE id = ? AND user_id = ?
  `;

  database.run(sql, [name, quantity, unit, id, req.user.userId], function (error) {
    if (error) {
      return res.status(500).json({ message: error.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Ingredient not found." });
    }

    res.json({ message: "Ingredient updated." });
  });
}

export function deleteIngredient(req, res) {
  const { id } = req.params;

  const sql = "DELETE FROM ingredients WHERE id = ? AND user_id = ?";

  database.run(sql, [id, req.user.userId], function (error) {
    if (error) {
      return res.status(500).json({ message: error.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Ingredient not found." });
    }

    res.json({ message: "Ingredient deleted." });
  });
}
