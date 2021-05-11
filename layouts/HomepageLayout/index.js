import styles from "./homepageLayout.module.css";

const HomepageWrapper = ({ children }) => {
  return (
    <>
      <figure>
        <img alt="" src="/decor/hmmm.png" />
      </figure>
      {children}
    </>
  );
}

const HomepageContent = ({ children }) => {
  return (
    <div className={styles.Homepage}>
      <div className={styles.Main}>
        <h1>habitat</h1>
        {children}
      </div>
    </div>
  );
}

const HomepageLayout = ({ children }) => {
  return (
    <HomepageWrapper>
      <HomepageContent>
        {children}
      </HomepageContent>
    </HomepageWrapper>
  )
}

export default HomepageLayout;