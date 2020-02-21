import React from "react"
import ContentLoader from "react-content-loader" 

const MyLoader = () => (
  <ContentLoader 
    speed={1}
    width={200}
    height={48.5}
    viewBox="0 0 200 50"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="50" y="5" rx="3" ry="3" width="90" height="6" /> 
    <rect x="50" y="20" rx="3" ry="3" width="120" height="6" /> 
    <rect x="50" y="33" rx="3" r="3" width="140" height="6" /> 
    <circle  cx="22" cy="22" r="22" />
  </ContentLoader>
)

export default MyLoader