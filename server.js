import express from "express";
import { Oso } from "oso";

const app = express();

const oso = new Oso();

// Loading a policy that allows only users with an admin role to access the "/admin" route
oso.loadFiles(["policy.polar"]);
// check authorization
async function authorize(req, res, next) {
  const { method, url } = req;
  const user = { role: "admin" };

  if (!(await oso.isAllowed(user, method, url))) {
    res.status(403).send("Forbidden");
  } else {
    next();
  }
}

app.use(authorize);

// A route that only users with the "admin" role can access
app.get("/admin", (req, res) => {
  res.send("This is an admin-only route!");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
