import { NextApiRequest, NextApiResponse } from "next";
import { getModule } from "util/db/module";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      var partitionKey = `module#${req.query.module[0]}#${req.query.module[1]}#${req.query.module[2]}`;
      await getModule(partitionKey)
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
