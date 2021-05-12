import ErrorPage from "../components/ErrorPage"

const Custom500 = () => {
  return (
    <ErrorPage {...{
      status: 500,
      message: 'internal server error'
    }} />
  );
}

export default Custom500;