import withSession from "../../../lib/session";

export const auth = ({ shield, redirect }) => withSession(async function ({ req, _ }) {
  const user = req.session.get('user');
  const shouldRedirect = shield ? !user : user;
  // shield = true when trying to access private resources, e.g. dashboard, and no session is found
  // false if redirecting because a session /is/ found, e.g. login -> dashboard
  if (shouldRedirect) {
    return {
      redirect: {
        destination: redirect,
        permanent: false
      }
    }
  }
  if (user) return {
    props: { user: req.session.get('user') }
  }
  return {
    props: {}
  }
});
