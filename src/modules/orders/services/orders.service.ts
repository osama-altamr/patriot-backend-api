import { Injectable, NotFoundException } from '@nestjs/common'
import { OrdersRepository } from '../repository/orders.repository'
import { CreateOrderDto } from '../api/dto/create-order.dto'
import { UpdateOrderDto } from '../api/dto/update-order.dto'
import { Order, OrderStatus } from '../../../database/entities/order.entity'
import { OrderItem } from '../../../database/entities/order-item.entity'
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

type PackableItem = {
    id: any;
    width: number;
    height: number;
}

@Injectable()
export class OrdersService {
    constructor(private readonly ordersRepository: OrdersRepository,
        private readonly orderItemRepository: OrderItemRepository,
        private readonly orderItemService: OrderItemService,
        private readonly userService: UserService,
        private readonly orderCodeService: OrderCodeService,
        private readonly notificationService: NotificationService,
        private readonly materialService: MaterialService,

    ) { }

    async glassCutting(inputData: GlassCuttingDto): Promise<any> {
        const material = await this.materialService.getMaterial(inputData.materialId);
        const width = inputData.width ?? material.width;
        const height = inputData.height ?? material.height;
    
        const allItems: PackableItem[] = (await this.orderItemRepository.findAll({})).map(item => ({
            id: item.id,
            width: item.width,
            height: item.height,
        }));
        
        // --- START: MANUAL GENETIC ALGORITHM IMPLEMENTATION ---
    
        const config = {
            iterations: 50, // قلل عدد الأجيال للسرعة في البداية
            size: 50, // حجم المجتمع
            mutationChance: 0.3, // فرصة حدوث طفرة
            fittestAlwaysSurvives: true,
        };
        
        // 1. إنشاء المجتمع الأولي (Initial Population)
        let population: PackableItem[][] = [];
        for (let i = 0; i < config.size; i++) {
            // إنشاء كروموسوم جديد (نسخة مخلوطة من القطع)
            population.push([...allItems].sort(() => 0.5 - Math.random()));
        }
    
        // دالة محلية لحساب الصلاحية (تعمل في نفس بيئتنا)
        const calculateFitness = (chromosome: PackableItem[]): number => {
            const packer = new MaxRectsPacker(width, height, 1);
            const rectangles = chromosome.map(item => {
                const rect = new Rectangle(item.width, item.height);
                rect.data = item;
                return rect;
            });
            packer.addArray(rectangles);
            
            let packedArea = 0;
            if (packer.bins[0]) {
                packer.bins[0].rects.forEach(rect => {
                    packedArea += rect.area()
                });
            }
            return packedArea;
        };
    
        // دالة محلية للطفرة
        const mutate = (chromosome: PackableItem[]): PackableItem[] => {
            if (Math.random() > config.mutationChance) {
                return chromosome; // لا تحدث طفرة
            }
            const mutated = [...chromosome];
            const indexA = Math.floor(Math.random() * mutated.length);
            const indexB = Math.floor(Math.random() * mutated.length);
            [mutated[indexA], mutated[indexB]] = [mutated[indexB], mutated[indexA]];
            return mutated;
        };
        
        let bestSolutionEver: PackableItem[] = [];
        let bestFitnessEver = -1;
    
        // 2. حلقة التطور الرئيسية (The Evolution Loop)
        for (let i = 0; i < config.iterations; i++) {
            // تقييم كل كروموسوم في المجتمع
            const scoredPopulation = population.map(chromosome => ({
                entity: chromosome,
                fitness: calculateFitness(chromosome)
            })).sort((a, b) => b.fitness - a.fitness); // الترتيب من الأفضل للأسوأ
    
            // تحديث أفضل حل تم العثور عليه حتى الآن
            if (scoredPopulation[0].fitness > bestFitnessEver) {
                bestFitnessEver = scoredPopulation[0].fitness;
                bestSolutionEver = scoredPopulation[0].entity;
            }
    
            console.log(`Generation: ${i}, Best Fitness: ${bestFitnessEver.toFixed(2)}`);
    
            // 3. إنشاء الجيل القادم
            const newPopulation: PackableItem[][] = [];
    
            // الحفاظ على أفضل حل (Elitism)
            if (config.fittestAlwaysSurvives) {
                newPopulation.push(scoredPopulation[0].entity);
            }
    
            // ملء باقي المجتمع بالحلول الجديدة
            while (newPopulation.length < config.size) {
                // اختيار "أب" باستخدام طريقة البطولة (Tournament)
                // نستخدم دوال genetic-js كأدوات مساعدة فقط
                const geneticInstance = { optimize: Genetic.Optimize.Maximize };
                const parent = Select1.Tournament2.call(geneticInstance, scoredPopulation);
                
                // تطبيق الطفرة لإنشاء "ابن"
                const child = mutate(parent);
                newPopulation.push(child);
            }
            
            population = newPopulation;
        }
    
        // --- END: MANUAL GENETIC ALGORITHM IMPLEMENTATION ---
    
        // 4. بعد انتهاء كل الأجيال، استخدم أفضل حل تم العثور عليه
        const finalPacker = new MaxRectsPacker(width, height, 1);
        const finalRectangles = bestSolutionEver.map(item => {
            const rect = new Rectangle(item.width, item.height);
            rect.data = item;
            return rect;
        });
        finalPacker.addArray(finalRectangles);
    
        const packedItems: any[] = [];
        let totalPackedArea = 0;
        if (finalPacker.bins[0]) {
            finalPacker.bins[0].rects.forEach(rect => {
                packedItems.push({
                    id: rect.data.id,
                    width: rect.width,
                    height: rect.height,
                    x: rect.x,
                    y: rect.y,
                });
                totalPackedArea += rect.area()
            });
        }
    
        const packedIds = new Set(packedItems.map(p => p.id));
        const unpackedItems = bestSolutionEver.filter(item => !packedIds.has(item.id));
        
        return {
            materialDimensions: { width, height },
            packedItems,
            unpackedItems,
            utilization: totalPackedArea / (width * height),
        };
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
        for (const item of createOrderDto.items) {
            console.log(order)
            await this.orderItemService.createOrderItem(order.id, item)
        }
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
        return order
    }

    async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
        const order = await this.findOne(id)
        const user = await this.userService.getMe(order.user.id)
        if(updateOrderDto.driverId){
            if(!order.driver) {
                updateOrderDto.driver = {id: updateOrderDto.driverId}
                updateOrderDto.status = OrderStatus.outForDelivery
                await this.orderCodeService.createOrderCode({ order, user }, updateOrderDto.estimatedDeliveryTime)
            }
            delete updateOrderDto.driverId;
        }
        if(updateOrderDto.status === OrderStatus.delivered){
            updateOrderDto.deliveredAt = new Date()
        }
        return await this.ordersRepository.update(id, updateOrderDto as any)
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id)
        await this.ordersRepository.delete(id)
    }

    async getOrderItems(orderId: string): Promise<OrderItem[]> {
        await this.findOne(orderId)
        return await this.orderItemRepository.findAll({
            filter: {
                where: {
                    order: { id: orderId }
                }
            }
        })
    }
} 
