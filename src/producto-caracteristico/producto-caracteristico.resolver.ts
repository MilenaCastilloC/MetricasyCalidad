import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { ProductoCaracteristicoDto } from './producto-caracteristico.dto';
import { ProductoCaracteristicoEntity } from './producto-caracteristico.entity';
import { ProductoCaracteristicoService } from './producto-caracteristico.service';

@Resolver()
export class ProductoCaracteristicoResolver {

  constructor(private productoCaracteristicoService: ProductoCaracteristicoService) { }

  @Query(() => [ProductoCaracteristicoEntity])
  productosCaracteristicos(): Promise<ProductoCaracteristicoEntity[]> {
    return this.productoCaracteristicoService.findAll();
  }

  @Query(() => ProductoCaracteristicoEntity)
  productoCaracteristico(@Args('id') id: string): Promise<ProductoCaracteristicoEntity> {
    return this.productoCaracteristicoService.findOne(id);
  }

  @Mutation(() => ProductoCaracteristicoEntity)
  createProductoCaracteristico(@Args('productoCaracteristico') productoCaracteristicoDto: ProductoCaracteristicoDto): Promise<ProductoCaracteristicoEntity> {
    const productoCaracteristico = plainToInstance(ProductoCaracteristicoEntity, productoCaracteristicoDto);
    return this.productoCaracteristicoService.create(productoCaracteristico);
  }

  @Mutation(() => ProductoCaracteristicoEntity)
  updateProductoCaracteristico(@Args('id') id: string, @Args('productoCaracteristico') productoCaracteristicoDto: ProductoCaracteristicoDto): Promise<ProductoCaracteristicoEntity> {
    const productoCaracteristico = plainToInstance(ProductoCaracteristicoEntity, productoCaracteristicoDto);
    return this.productoCaracteristicoService.update(id, productoCaracteristico);
  }

  @Mutation(() => String)
  deleteProductoCaracteristico(@Args('id') id: string) {
    this.productoCaracteristicoService.delete(id);
    return id;
  }
}