import { NextApiRequest, NextApiResponse } from "next";
import { getModule, deleteModule } from "util/db/module";
import { checkAuth } from "util/auth";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      //@ts-ignore
      await getModule(req.query.module)
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.status(400).send(err.message);
        });

    case "DELETE":
      try {
        checkAuth(req, "admin");
      } catch (err) {
        return res.status(401).send(err.message);
      }

      // @ts-ignore
      await deleteModule(req.query.module)
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.status(400).send(err.message);
        });
    default:
      return res.status(405).end();
  }
};

export default index;
