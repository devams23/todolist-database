import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
const app = express();
const port = 3000;

// ----------------------- MAKING A DATABASE OBJECT ----------------------------
const db = new pg.Client({
  user: "",
  host: "",
  database: " ",
  password: "",
  port: 5432,
});
db.connect(); // ----------------------   CONNNECTING TO DATABASE ---------------

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const items = await getitems();
  console.log(items);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  const img = 
  await db.query("INSERT INTO items(title) VALUES ($1)", [item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const idtoedit = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;
  await db.query("UPDATE  items SET title = $1 WHERE id = $2", [
    title,
    idtoedit,
  ]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const idtoedit = req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id = $1", [idtoedit]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

async function getitems() {
  let items = [];
  const resp = await db.query("SELECT * FROM items");
  resp.rows.forEach((element) => {
    items.push(element);
  });
  return items;
}
