import React from "react"
import ContentLoader from "react-content-loader" 

const MyLoader = () => (
  <ContentLoader 
    speed={1}
    width={200}
    height={43}
    viewBox="0 0 200 50"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="50" y="10" rx="3" ry="3" width="100" height="6" /> 
    <rect x="50" y="25" rx="3" ry="3" width="140" height="6" /> 
    <circle  cx="25" cy="20" r="20" />
  </ContentLoader>
)

export default MyLoader