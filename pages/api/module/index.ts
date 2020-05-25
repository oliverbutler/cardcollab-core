import { NextApiRequest, NextApiResponse } from "next";
import { addModule, getModules } from "util/db/module";
import { checkAuth } from "util/auth";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      try {
        checkAuth(req, "admin");
      } catch (err) {
        return res.status(401).send(err.message);
      }
      await addModule(req.body.module, req.body.title, req.body.active)
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.status(400).send(err.message);
        });
      break;
    case "GET":
      await getModules(req.body.module, req.body.search)
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.status(400).send(err.message);
        });
      break;
    default:
      return res.status(405).end();
  }
};

export default index;
