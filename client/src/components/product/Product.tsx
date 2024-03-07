import { useNavigate, useParams } from 'react-router-dom'
import Styles from '../../css/product/Product.module.css'
import { useQuery } from '@apollo/client';
import { GET_PRODUCT } from '../../graphql/queries/productQueries';
import Loader from '../loaders/Loader';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate()
  const { error, loading, data } = useQuery(GET_PRODUCT, {
    variables: { id }
  });

  if (loading) {
    return (<Loader />)
  }
  else if (error) {
    navigate("/")
  }
  // to remove-:
  else {
    console.log(data.product)
  }

  return (
    <div className={Styles.productContainer}>
      <div className={Styles.productMainContainer}>
        <div className={Styles.productImageContainer}>
          <div className={Styles.productThumbnailContainer}>

          </div>
        </div>
      </div>
    </div>
  )
}
