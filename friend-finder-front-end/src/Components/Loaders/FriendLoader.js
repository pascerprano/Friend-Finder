import React from "react"
import ContentLoader from "react-content-loader" 

const MyLoader = () => (
  <ContentLoader 
    speed={1}
    width={200}
    height={40}
    viewBox="0 0 200 40"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="0" y="5.5" rx="0" ry="0" width="35" height="40" />
    <rect x="40" y="15" rx="0" ry="0" width="40" height="6" />
    <rect x="40" y="25" rx="0" ry="0" width="90" height="6" />
    <rect x="165" y="17" rx="0" ry="0" width="30" height="13" />
  </ContentLoader>
)

export default MyLoader