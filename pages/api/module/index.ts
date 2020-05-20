import { NextApiRequest, NextApiResponse } from "next";
import { addModule, getModules } from "util/db/module";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
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
    case "GET":
      await getModules(req.body.university, req.body.moduleCode)
        .then((value) => {
          var items = [];
          // @ts-ignore
          value.Items.map((item) => {
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
    default:
      return res.status(405).end();
  }
};

export default index;
