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
import { VerifyOrderValidation } from '../validations/verify-code.dto'
import { VerifyOrderCodeDto } from '../dto/verify-order-code.dto'
import { OrderCodeService } from '/orders/services/order-code.service'
import { UpdateOrderItemDto } from '../dto/update-order-item.dto'
import { OrderItemService } from '/orders/services/order-items.service'
import { GlassCuttingDto } from '../dto/glass-cutting.dto'
import { UserService } from '/users/services/user.service'
import { CreateOrderItemAction } from '../dto/create-order-item-action.dto'
import { MaterialService } from '/materials/services/material.service'

@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly userService: UserService,
    private readonly orderCodeService: OrderCodeService,
    private readonly orderItemService: OrderItemService,
  ) {}

  @Post()
  async create(
    @Body(CreateOrderValidation) createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return await this.ordersService.create(createOrderDto)
  }

    @Get('items')
    async getItems(@Query('currentStageId') currentStageId?: string,
    @Query('employeeId')  employeeId?: string
     ){
    const items = await this.ordersService.getItems(currentStageId, employeeId)
      return {
        results: items,
        total: items.length
      }
    }

    @Get('items/:itemId')
    async getOrderItem(@Param('itemId') id: string): Promise<OrderItem> {
      return await this.ordersService.getOrderItem(id)
    }

    @Patch('items/:itemId')
    updateOrderItem(
      @Param('itemId') itemId: string,
      @Body() orderItemData: UpdateOrderItemDto
    ): Promise<OrderItem> {
      return this.orderItemService.updateOrderItem(itemId, orderItemData)
    }

    @Post('items/:itemId/actions')
    createAction(
      @Param('itemId') itemId: string,
      @Body() itemActionData: CreateOrderItemAction
    ) {
      return this.orderItemService.createAction(itemId, itemActionData)
    }

    @Post('glass-cutting')
    async glassCuttingAlgo(
      @Body() input: GlassCuttingDto
    ) {
      this.ordersService.startGlassCuttingJob(input);
      return { 
        status: 202,
        message: 'Glass cutting job has been accepted and is being processed in the background.',
      };
    }

  @Get('material-grid')
  async getMaterialGrid(
  ) {
    const data = await this.ordersService.getMaterialGrid()
   return data
  }

 @Delete('/cutting-results')
  async delete(
  ) {
   await this.ordersService.deleteResult()
  }

  @Post(':id/verify-codes')
  async verifyOrderCode(@Param('id') id: string, @Body(VerifyOrderValidation) orderCodeData:  VerifyOrderCodeDto): Promise<{ isValid: boolean, message?: string }> {
    const order = await this.ordersService.findOne(id)
    return await this.orderCodeService.verifyCode({ 
      code: orderCodeData.code,
      orderId:  order.id
     })
  }

  @Get(':id/items')
  async getOrderItems(@Param('id') id: string, @Query('currentStage') currentStageId?: string): Promise<OrderItem[]> {
    return await this.ordersService.getOrderItems(id,currentStageId)
  }
  
  @Post(':id/send-codes')
  async sendOrderCode(@Param('id') id: string) {
    const order = await this.ordersService.findOne(id)
    const user = await this.userService.getMe(order.user.id)
    return await this.orderCodeService.createOrderCode({ 
      order,
      user,
     })
  }


  @Get()
  async findAll(
    @Query() query: GetAllOrdersDto
  ){
    const q = parseQuery(query)
    const data = await this.ordersService.findAll(q.myQuery, q.pagination)
    return {
      results: data,
      total: data.length,
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.findOne(id)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return await this.ordersService.update(id, updateOrderDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.ordersService.remove(id)
  }

  // @Post(':id/items')
  // createOrderItem(
  //   @Param('id') id: string,
  //   @Body() orderItemData: Partial<OrderItem>
  // ): Promise<OrderItem> {
  //   return this.ordersService.createOrderItem(id, orderItemData)
  // }
} 