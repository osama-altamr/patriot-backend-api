import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { OrdersRepository } from '../repository/orders.repository'
import { CreateOrderDto } from '../api/dto/create-order.dto'
import { UpdateOrderDto } from '../api/dto/update-order.dto'
import { Order, OrderStatus } from '../../../database/entities/order.entity'
import { OrderItem, OrderItemStatus } from '../../../database/entities/order-item.entity'
import { OrderItemRepository } from '../repository/order-item.repository'
import { Pagination, QueryValue } from '@Package/api'
import { GetAllOrdersDto } from '../api/dto/get-all.dto'
import { NotificationService } from '/notifications/services/notification.service'
import { UserService } from '/users/services/user.service'
import { OrderCodeService } from './order-code.service'
import { OrderItemService } from './order-items.service'
import { GlassCuttingDto } from '../api/dto/glass-cutting.dto'
import { MaterialService } from '/materials/services/material.service'
import * as Genetic from 'genetic-js';
import  { Select1 } from 'genetic-js';
import { MaxRectsPacker, Rectangle } from 'maxrects-packer';
import { StateService } from '/states/services/state.service'
import { CityService } from '/city/services/city.service'
import * as path from 'path'; 
import { Worker } from 'worker_threads';
import { OrderItemActionRepository } from '../repository/order-item-action.repository'
import * as fs from 'fs/promises';
import { ProductService } from '/products/services/product.service'
import { PermissionRepository } from '/permissions/repository/permission.repository'

type PackableItem = {
    id: any;
    width: number;
    height: number;
}

export let glassCuttingData: any = {} 
const CUTTING_RESUL_FILE_PATH = 'glassCuttingResults.json'
@Injectable()
export class OrdersService {
    constructor(private readonly ordersRepository: OrdersRepository,
        private readonly orderItemRepository: OrderItemRepository,
        private readonly orderItemActionRepo: OrderItemActionRepository,
        private readonly orderItemService: OrderItemService,
        private readonly userService: UserService,
        private readonly notificationService: NotificationService,
        private readonly materialService: MaterialService,
        private readonly stateService: StateService,
        private readonly cityService: CityService,
        private readonly permissionRepo: PermissionRepository,
    ) { }

    async startGlassCuttingJob(inputData: GlassCuttingDto): Promise<void> {
        const material = await this.materialService.getMaterial(inputData.materialId);
        if(material){
            await this.materialService.updateMaterial(material.id, {
                quantity: material.quantity - 1
            } as any)
        }
        const width = inputData.width ?  inputData.width.toString() as any :material.width;
        const height = inputData.height ?  inputData.height.toString() as any :material.height;
    
        const allItems = (await this.orderItemRepository.findAll({
            filter: {
                where: { status: OrderItemStatus.pending }
            }
        })).map(item => ({
            id: item.id.toString(),
            width: item.width,
            height: item.height,
        }));
        
        const packableItems = allItems.filter(item => 
            (item.width <= width && item.height <= height) || 
            (item.height <= width && item.width <= height)
        );
    
        if (packableItems.length === 0) {
            console.log('No items fit the material. Job aborted.');
            return;
        }
    
        const worker = new Worker(path.resolve(__dirname, '../workers/glass-cutting.worker.js'));
    
        worker.on('message', async (result) => {
          if (result.status === 'completed') {
            console.log(`Worker job completed. Saving results...`);
            try {
                const data = result.data;
                await fs.writeFile(CUTTING_RESUL_FILE_PATH, JSON.stringify(data, null, 2));
               console.log(`Results saved to database. Result ID: ${data}`);
            } catch(dbError) {
                console.log('Failed to save the result to the database.', dbError.stack);
            }
          } else {
            console.log(`Worker job failed with error: ${result.error}`);
          }
        });
    
        worker.on('error', (error) => {
          console.log(`A critical error occurred in the worker thread:`, error);
        });
    
        worker.on('exit', (code) => {
          console.log(`Worker exited with code ${code}.`);
        });
        
        worker.postMessage({ 
            width,
            height,
            packableItems,
            originalMaterialId: inputData.materialId
        })
      }

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        const random4Digit = Math.floor(1000 + Math.random() * 9000); 
        const newRef = `DO-${random4Digit}`;
        const user = await this.userService.getMe(createOrderDto.userId)
        const order = await this.ordersRepository.create({
            ...createOrderDto,
            ref: newRef,
            user,
        } as any) as Order

        await this.notificationService.createNotification({
            title: {
                en: `New Order #${order.ref }`,
                ar: `طلب جديد #${order.ref}`
              },
              content: {
                en: `Your order has been placed successfully`,
                ar: `تم تقديم طلبك بنجاح.`
              },
            recordId: order.id,
            type: 'order',
            userId: user.id,
            user: user,
        })
        const hasCustomItems = createOrderDto.items.some(item => item.stageIds && item.stageIds.length > 0);
        for(const item of createOrderDto.items){
            await this.orderItemService.createOrderItem(order.id, item)
        }
       
        if (hasCustomItems) {
            const adminsToNotify = await this.permissionRepo.getAllWithPop({
            accessType: 'admin' 
            })
           await Promise.all(adminsToNotify.map(async admin => {
            await this.notificationService.createNotification({
                title: {
                    en: `Action Required for Order #${order.ref}`,
                    ar: `إجراء مطلوب للطلب #${order.ref}`
                },
                content: {
                    en: `Order #${order.ref} contains custom items that require a price to be set.`,
                    ar: `يحتوي الطلب #${order.ref} على عناصر مخصصة تتطلب تحديد السعر.`
                },
                recordId: order.id,
                type: 'order',
                userId: admin.user.id,
            });
           }))
        }

        if(order.address && order.address.cityId) {
            order.address.city = await this.cityService.getCity(order.address.cityId)
        }
        if(order.address && order.address.stateId) {
            order.address.state = await this.stateService.getState(order.address.stateId)
        }
        return await this.ordersRepository.findOneById(order.id)
    }

    async findAll(query: QueryValue<GetAllOrdersDto>, pagination: Pagination): Promise<Order[]> {
        return await this.ordersRepository.findAllForUser(query, pagination)
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.ordersRepository.findOneById(id)
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`)
        }
        if(order.address && order.address.cityId) {
            order.address.city = await this.cityService.getCity(order.address.cityId)
        }
        if(order.address && order.address.stateId) {
            order.address.state = await this.stateService.getState(order.address.stateId)
        }

        order.items = await Promise.all(order.items.map(async item => {
            item.orderItemActions = await this.orderItemActionRepo.getItemActions(item.id) as any
            return item
          }))
        
        return order
    }

    async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
        const order = await this.findOne(id)
        const user = await this.userService.getMe(order.user.id)
        if(updateOrderDto.driverId){
            if(!order.driver) {
                updateOrderDto.driver = {id: updateOrderDto.driverId}
                updateOrderDto.status = OrderStatus.outForDelivery
                updateOrderDto.outForDeliveryAt = new Date()
            }
            delete updateOrderDto.driverId;
        }
        if(updateOrderDto.status === OrderStatus.delivered){
            updateOrderDto.deliveredAt = new Date()
        }
        if(order.address && order.address.cityId) {
            order.address.city = await this.cityService.getCity(order.address.cityId)
        }
        if(order.address && order.address.stateId) {
            order.address.state = await this.stateService.getState(order.address.stateId)
        }

        return await this.ordersRepository.update(id, updateOrderDto as any)
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id)
        await this.ordersRepository.delete(id)
    }

    async getOrderItems(orderId: string, currentStageId: string): Promise<OrderItem[]> {
        await this.findOne(orderId)
        return await this.orderItemRepository.findAllWithPop({
            order: { id: orderId },
            currentStage: { id: currentStageId }
        })
    }

    async getItems(currentStageId: string, employeeId: string): Promise<OrderItem[]> {
        const query: any = {}
        if(currentStageId) {
            query.currentStage = { id: currentStageId }
        }
        if(employeeId) {
            query.employee = { id: employeeId }
        }
        return await this.orderItemRepository.findAllWithPop(query)
    }

    async getOrderItem(id: string): Promise<OrderItem> {
        return await this.orderItemService.getOrderItem(id)
    }


    async getMaterialGrid () {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const filePath = path.join(process.cwd(), 'glassCuttingResults.json');
        const fileData = await fs.readFile(filePath, 'utf-8');
        const glassCuttingData = JSON.parse(fileData);
        glassCuttingData.packableItems = await Promise.all(glassCuttingData.packedItems.map(async packItem => 
            {
                packItem.item = await this.orderItemService.getOrderItem(packItem.id)
                delete packItem.item.qrCode
                return packItem
            }
        ) )
        return glassCuttingData
    }

    async deleteResult () {
        await new Promise(resolve => setTimeout(resolve, 5000));
        const filePath = path.join(process.cwd(), 'glassCuttingResults.json');
        await fs.writeFile(filePath, JSON.stringify({}, null, 2));
    }
} 
