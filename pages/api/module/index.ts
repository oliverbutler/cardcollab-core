import { NextApiRequest, NextApiResponse } from "next";
import { addModule, getModules } from "util/db/module";
import { checkAuth } from "util/auth";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      try {
        checkAuth(req);
      } catch (err) {
        return res.status(401).send(err.message);
      }
      await addModule(req.body.module, req.body.title, (req.body.active = true))
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
    // case "DELETE":
    //   await getModules(req.body.university, "").then((modules) => {
    //     modules.forEach(async (module) => {
    //       await deleteModule(module.sortKey);
    //     });
    //     return res.send(modules);
    //   });
    default:
      return res.status(405).end();
  }
};

export default index;
