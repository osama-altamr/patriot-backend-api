import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common'
import { OrdersService } from '../../services/orders.service'
import { CreateOrderDto } from '../dto/create-order.dto'
import { UpdateOrderDto } from '../dto/update-order.dto'
import { Order } from '../../../../database/entities/order.entity'
import { OrderItem } from '../../../../database/entities/order-item.entity'
import { AuthControllerWeb, CurrentUser } from '@Package/api'
import { CreateOrderValidation } from '../validations/create-order.dto'
import { GetAllOrdersDto } from '../dto/get-all.dto'
import { parseQuery } from '@Package/api/functions'


@AuthControllerWeb({prefix: "orders"})
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Body(CreateOrderValidation) createOrderDto: CreateOrderDto,
    @CurrentUser() user: any
  ): Promise<Order> {
    return this.ordersService.create(createOrderDto, user)
  }

  @Get()
  findAll(
    @Query() query: GetAllOrdersDto
  ): Promise<Order[]> {
    const q = parseQuery(query)
    return this.ordersService.findAll(q.myQuery, q.pagination)
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(id)
  }orderItemData

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.ordersService.remove(id)
  }

  // @Post(':id/items')
  // createOrderItem(
  //   @Param('id') id: string,
  //   @Body() orderItemData: Partial<OrderItem>
  // ): Promise<OrderItem> {
  //   return this.ordersService.createOrderItem(id, orderItemData)
  // }

  @Get(':id/items')
  getOrderItems(@Param('id') id: string): Promise<OrderItem[]> {
    return this.ordersService.getOrderItems(id)
  }
} 