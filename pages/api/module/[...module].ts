import { NextApiRequest, NextApiResponse } from "next";
import { getModule } from "util/db/module";
import { hashToArray } from "util/functions";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      //@ts-ignore
      await getModule(req.query.module)
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.send(err);
        });
    default:
      return res.status(405).end();
  }
};

export default index;
