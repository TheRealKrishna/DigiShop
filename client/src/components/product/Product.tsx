import { useNavigate, useParams } from 'react-router-dom'
import Styles from '../../css/product/Product.module.css'
import { useQuery } from '@apollo/client';
import { GET_PRODUCT } from '../../graphql/queries/productQueries';
import Loader from '../loaders/Loader';
import { useEffect, useState } from 'react';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate()
  const { error, loading, data } = useQuery(GET_PRODUCT, {
    variables: { id }
  });
  const [product, setProduct] = useState<any>({})
  
  useEffect(()=>{
    if(!loading){
      setProduct(data.product)
    }
  }, [data, loading])

  if (loading) {
    return (<Loader />)
  }
  else if (error) {
    navigate("/")
  }
  return (
    <div className={Styles.productContainer}>
      <div className={Styles.productMainContainer}>
        <div className={Styles.productImageContainer}>
          <div className={Styles.productThumbnailContainer}>
            <img src={product.thumbnail} alt="" />
          </div>
        </div>
        <div className={Styles.productInfoContainer}>
          <h3>{product.title}</h3>
        </div>
      </div>
    </div>
  )
}
