export default (req, res) => {
  console.log(res.body);
  res.status(200).json({ text: "Hello" });
};
