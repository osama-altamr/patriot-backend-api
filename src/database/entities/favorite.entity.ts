import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from './common.entity';
import { User } from './user.entity';
import { Product } from './product.entity'; 

@Entity()
export class Favorite extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  
  @ManyToOne(() => User, (user) => user.favorites, {
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'user_id' }) 
  user: User;
  
  @ManyToOne(() => Product, (product) => product.favoritedBy, {
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'product_id' }) 
  product: Product;
}

export abstract class IFavorite {
  id: string;
  user: User;
  product: Product;
}