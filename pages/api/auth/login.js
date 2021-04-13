import withSession from "../../../lib/session";

export default withSession(async (req, res) => {
  const { user } = req.body;
  req.session.set('user', user);
  await req.session.save();
  res.send({ user });
});
