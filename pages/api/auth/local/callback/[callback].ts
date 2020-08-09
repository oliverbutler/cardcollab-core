import { NextApiRequest, NextApiResponse } from "next";
import { verifyCallback, updateUserAuthLocal } from "util/db/auth";

const callback = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.callback) return res.status(400).end();
  try {
    // @ts-ignore
    var data = await verifyCallback(req.query.callback);

    if (typeof data != "string") return res.status(400).send("Invalid token");

    await updateUserAuthLocal(data, { emailVerified: true });

    res.writeHead(301, {
      Location: "https://cardcollab.com",
    });
    res.end();
  } catch (err) {
    console.log(err);
    return res.status(400).send("Invalid token");
  }
};

export default callback;
