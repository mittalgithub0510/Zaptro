import { useContext } from 'react'
import { DataContext } from '../Context/DataContext'
import { useNavigate } from 'react-router-dom'

const Category = () => {

    const { data } = useContext(DataContext)
    const navigate = useNavigate()

    const getUniqueCategory = (data, property) => {
        let newVAL = data?.map((curElem) => curElem[property])
        newVAL = [...new Set(newVAL)]
        return newVAL
    }

    const categoryOnlyData = getUniqueCategory(data, "category")

    return (
        <div className='heroCategorys'>
            <div className='Categorys'>
                {categoryOnlyData.map((item, index) => {
                    return (
                        <div key={index}>
                            <button
                                className='Categoryitem'
                                onClick={() =>
                                    navigate("/product", {
                                        state: { selectedCategory: item }
                                    })
                                }
                            >
                                {item}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Category