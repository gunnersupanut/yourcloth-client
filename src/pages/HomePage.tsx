import Banner from "../components/Banner";
import { Link } from "react-router-dom";

// import components
import FeaturedSlider from "../components/FeaturedSlider";
import Category from "../components/Category";

const Homepage = () => {
  return (
    <div>
      {/* <p className="text-h1xl text-primary pl-5">Home</p>
      <p className="text-h2xl text-primary pl-5 my-2">New Collection</p> */}
      {/* Banner Component*/}
      <Banner />
      <div className="container mx-auto px-12 py-8">
        <p className="text-h2xl text-primary mb-8">New Available</p>
        <FeaturedSlider />
        <div className="text-ui text-primary underline flex justify-end p-6 mr-10 mb-10 ">
          <Link to={"/shop"} className="hover:text-secondary">
            {" "}
            View All
          </Link>
        </div>
        <p className="text-h2xl text-primary mb-8">Category</p>
        <div>
          <Category />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
