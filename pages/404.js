import ErrorPage from "../components/ErrorPage"

const Custom404 = () => {
  return (
    <ErrorPage {...{
      status: 404,
      message: 'page not found'
    }} />
  );
}

export default Custom404;