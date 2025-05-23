import { IProduct, IProductReview, IUser } from 'src/database'

export class CreateProductReviewDto implements Omit<IProductReview, 'id' | 'product'> {
  title?: string
  comment?: string
  rating: number
  productId: string 
  user?: IUser
  product?: IProduct
}