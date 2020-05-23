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
      await addModule(
        req.body.university,
        req.body.module,
        req.body.title,
        (req.body.active = true)
      )
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.send(err);
        });
      break;
    case "GET":
      await getModules(req.body.university, req.body.moduleCode)
        .then((value) => {
          var items = [];
          // @ts-ignore
          value.map((item) => {
            items.push(
              item.sortKey.substring(
                `module#uni#${req.body.university}#${req.body.moduleCode}`
                  .length,
                item.sortKey.length
              )
            );
          });
          return res.send(items);
        })
        .catch((err) => {
          return res.send(err);
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
