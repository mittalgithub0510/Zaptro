import React, { useContext } from "react";
import { DataContext } from "../Context/DataContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import Category from "./Category";

const Carousel = () => {
    const { data } = useContext(DataContext);

const SamplePrevArrow = ({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#C1C1D6",
        borderRadius: "50%",
        width: "30px",
        height: "30px",
        left: "20px",          
        zIndex: 3000,
      }}
      onClick={onClick}
    >
      <AiOutlineArrowLeft size={20} color="black" />
    </div>
  );
};

const SampleNextArrow = ({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#C1C1D6",
        borderRadius: "50%",
        width: "30px",
        height: "30px",
        right: "20px",        
        zIndex: 3000,
      }}
      onClick={onClick}
    >
      <AiOutlineArrowRight size={20} color="black" />
    </div>
  );
};

    const settings = {
        dots: false,
        autoplay:true,
        pauseOnHover:false,
        autoplaySpeed:2000,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };

    return (
        <div className="carousel-wrap">
            <Category />
            <Slider {...settings}>
                {data?.slice(10, 19).map((item, index) => (
                    <div key={item.id} className="carousel">
                        <div className="slider">
                            <div className="hero-text">
                                <span className="category">{item.subCategory}</span>
                                <h2>{item.name}</h2>
                                <p className="desc">
                                    {item.description}
                                </p>
                                <div className="bottom-info">
                                    <p className="price">
                                        ₹ {(item.priceCents / 100).toFixed(2)}
                                    </p>
                                    <p className="rating">
                                        ⭐ {item.rating.stars} ({item.rating.count})
                                    </p>
                                </div>
                                <button className="buy-btn">Explore</button>
                            </div>

                            <div className="hero-image">
                                <img src={item.image} alt={item.name} />
                            </div>
                        </div>
                    </div>
                ))
                }
            </Slider >
            
        </div >
    );
};

export default Carousel;
