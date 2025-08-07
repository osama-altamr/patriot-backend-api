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
import { StateService } from '/states/services/state.service'
import { CityService } from '/city/services/city.service'

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
        private readonly stateService: StateService,
        private readonly cityService: CityService,

    ) { }
    private crossover(
        parent1: PackableItem[], 
        parent2: PackableItem[],
        materialWidth: number,
        materialHeight: number
    ): PackableItem[] {
        // أخذ 30% من العناصر من الأب الأول (على الأقل عنصر واحد)
        const segmentSize = Math.max(1, Math.floor(parent1.length * 0.3));
        const start = Math.floor(Math.random() * (parent1.length - segmentSize));
        const childPart = parent1.slice(start, start + segmentSize);
        
        // إنشاء مجموعة من المعرفات المحددة
        const selectedIds = new Set(childPart.map(item => item.id));
        
        // أخذ العناصر المتبقية من الأب الثاني مع احتمال التدوير
        const remainingFromParent2 = parent2
            .filter(item => !selectedIds.has(item.id))
            .map(item => {
                const shouldRotate = Math.random() > 0.5 && 
                                  item.height <= materialWidth && 
                                  item.width <= materialHeight;
                return shouldRotate 
                    ? { ...item, width: item.height, height: item.width }
                    : item;
            });
        
        // دمج النتائج مع التحقق من التكرار
        const result = [...childPart, ...remainingFromParent2];
        const uniqueIds = new Set(result.map(item => item.id));
        
        if (uniqueIds.size !== result.length) {
            console.warn('تم اكتشاف معرفات مكررة بعد التهجين');
            return result.filter((item, index, self) =>
                index === self.findIndex(i => i.id === item.id)
            );
        }
        
        return result;
    }
    
    private shuffleWithPriority(items: PackableItem[]): PackableItem[] {
        // ترتيب العناصر الكبيرة أولاً، ثم خلط ضمن مجموعات الحجم
        return [...items]
            .sort((a, b) => (b.width * b.height) - (a.width * a.height))
            .map((item, i, arr) => 
                i > 0 && Math.random() > 0.7 && 
                (arr[i-1].width * arr[i-1].height) === (item.width * item.height)
                    ? [arr[i], arr[i-1]]
                    : [item, arr[i-1]]
            )
            .flat()
            .filter(Boolean);
    }
    
    private findBestGap(rectangles: Rectangle[], width: number, height: number): {x: number, y: number, space: number} {
        const gaps: {x: number, y: number, space: number}[] = [];
        
        // تحليل الفراغات الأفقية
        rectangles.forEach(rect => {
            const rightSpace = width - (rect.x + rect.width);
            if (rightSpace > 0) {
                gaps.push({
                    x: rect.x + rect.width,
                    y: rect.y,
                    space: rightSpace * rect.height
                });
            }
        });
        
        // تحليل الفراغات الرأسية
        rectangles.forEach(rect => {
            const bottomSpace = height - (rect.y + rect.height);
            if (bottomSpace > 0) {
                gaps.push({
                    x: rect.x,
                    y: rect.y + rect.height,
                    space: rect.width * bottomSpace
                });
            }
        });
        
        // ترتيب الفراغات من الأكبر إلى الأصغر
        gaps.sort((a, b) => b.space - a.space);
        
        return gaps[0] || null; // إرجاع أكبر فراغ
    }
    
    async glassCutting(inputData: GlassCuttingDto): Promise<any> {
        const material = await this.materialService.getMaterial(inputData.materialId);
        const width = inputData.width ?? material.width;
        const height = inputData.height ?? material.height;
    
        console.log(`عملية القطع الأمثل على مادة مقاس ${width}x${height}`);
    
        // الحصول على جميع العناصر من قاعدة البيانات
        const allItems = (await this.orderItemRepository.findAll({})).map(item => ({
            id: item.id,
            width: item.width,
            height: item.height,
        }));
        
        // تصفية العناصر التي تناسب المادة (مع أو بدون تدوير)
        const packableItems = allItems.filter(item => 
            (item.width <= width && item.height <= height) || 
            (item.height <= width && item.width <= height)
        );
    
        if (packableItems.length === 0) {
            return {
                materialDimensions: { width, height },
                packedItems: [],
                unpackedItems: allItems,
                utilization: 0,
            };
        }
        
        // إعداد خوارزمية جينية
        const config = {
            iterations: 700,
            populationSize: 200, 
            mutationChance: 0.4,
            crossoverChance: 0.85,
            fittestAlwaysSurvives: true,
            eliteCount: 5
        };
        
        // تهيئة المجتمع الأولي مع تدوير ذكي
        let population: PackableItem[][] = [];
        for (let i = 0; i < config.populationSize; i++) {
            const individual = packableItems.map(item => {
                // تفضيل التدوير عندما يحسن استخدام المساحة
                const shouldRotate = item.height > item.width && 
                                   item.width <= height && 
                                   item.height <= width;
                return shouldRotate 
                    ? { ...item, width: item.height, height: item.width } 
                    : item;
            });
            
            population.push(this.shuffleWithPriority(individual));
        }
    
        // دالة اللياقة
        const calculateFitness = (chromosome: PackableItem[]) => {
            // التحقق أولاً من العناصر المكررة
            const uniqueItems = chromosome.filter((item, index, self) =>
                index === self.findIndex(i => i.id === item.id)
            );
            
            if (uniqueItems.length !== chromosome.length) {
                return -Infinity; // عقوبة شديدة للعناصر المكررة
            }
    
            const packer = new MaxRectsPacker(width, height, 1, {
                smart: true,
                pot: true,
                square: false
            });
            
            // ترتيب حسب المساحة تنازلياً لتحسين التعبئة
            const sorted = [...chromosome].sort((a, b) => 
                (b.width * b.height) - (a.width * a.height));
            
            const rectangles = sorted.map(item => {
                const rect = new Rectangle(item.width, item.height);
                rect.data = item;
                return rect;
            });
            
            packer.addArray(rectangles);
            
            if (!packer.bins[0]) return 0;
            
            let packedArea = 0;
            let outOfBounds = false;
            let wastedSpace = 0;
            let usableGaps = 0;
            const binArea = width * height;
        
    
            packer.bins[0].rects.forEach(rect => {
                // التحقق من الحدود
                if (rect.x + rect.width > width || rect.y + rect.height > height) {
                    outOfBounds = true;
                    return;
                }
                
                packedArea += rect.area();
                
                // حساب الفراغات القابلة للاستخدام
                const rightSpace = width - (rect.x + rect.width);
                const bottomSpace = height - (rect.y + rect.height);
                
                if (rightSpace >= 20) usableGaps++;
                if (bottomSpace >= 19) usableGaps++;
            });
        
            // حساب المساحة المهدرة
            wastedSpace = binArea - packedArea;
            
            wastedSpace = binArea - packedArea - (usableGaps * 20 * 19 * 0.5);
    
            // معاملات العقاب والمكافأة
            const outOfBoundsPenalty = outOfBounds ? 0.5 : 1;
            const gapBonus = 1 + (usableGaps * 0.05);
            
            return (packedArea / binArea) * outOfBoundsPenalty * gapBonus - (wastedSpace / binArea);
        };
    
        // دالة التحول
        const mutate = (chromosome: PackableItem[]) => {
            const mutated = [...chromosome];
            
            if (Math.random() < config.mutationChance) {
                // تبديل عنصرين عشوائيين
                const i1 = Math.floor(Math.random() * mutated.length);
                const i2 = Math.floor(Math.random() * mutated.length);
                [mutated[i1], mutated[i2]] = [mutated[i2], mutated[i1]];
                
                // تدوير عنصر عشوائي
                if (Math.random() < 0.5) {
                    const idx = Math.floor(Math.random() * mutated.length);
                    const item = mutated[idx];
                    if (item.height <= width && item.width <= height) {
                        mutated[idx] = { ...item, width: item.height, height: item.width };
                    }
                }
                
                // نقل العناصر الكبيرة إلى المقدمة
                if (Math.random() < 0.3) {
                    const largeItems = mutated
                        .map((item, index) => ({index, area: item.width * item.height}))
                        .sort((a, b) => b.area - a.area);
                    
                    if (largeItems.length > 0) {
                        const [largeItem] = largeItems;
                        const [item] = mutated.splice(largeItem.index, 1);
                        mutated.unshift(item);
                    }
                }
            }
            
            return mutated;
        };
        
        // الحلقة التطورية
        let bestSolution: PackableItem[] = [];
        let bestFitness = -Infinity;
        let stagnationCount = 0;
    
        for (let gen = 0; gen < config.iterations; gen++) {
            // تقييم المجتمع
            const scored = population.map(chromosome => ({
                entity: chromosome,
                fitness: calculateFitness(chromosome)
            })).sort((a, b) => b.fitness - a.fitness);
    
            // التحقق من أفضل حل جديد
            if (scored[0].fitness > bestFitness) {
                bestFitness = scored[0].fitness;
                bestSolution = scored[0].entity;
                stagnationCount = 0;
            } else {
                stagnationCount++;
            }
    
            // خروج مبكر إذا لم يكن هناك تحسن
            if (stagnationCount > 50) break;
    
            // إنشاء جيل جديد
            const newPopulation: PackableItem[][] = [];
            
            // الاحتفاظ بالنخبة
            if (config.fittestAlwaysSurvives) {
                newPopulation.push(...scored.slice(0, config.eliteCount).map(s => s.entity));
            }
    
            // ملء بقية المجتمع
            while (newPopulation.length < config.populationSize) {
                let child: PackableItem[];
                
                if (Math.random() < config.crossoverChance) {
                    const parent1 = Select1.Tournament2.call(
                        { optimize: Genetic.Optimize.Maximize }, scored);
                    const parent2 = Select1.Tournament2.call(
                        { optimize: Genetic.Optimize.Maximize }, scored);
                    child = this.crossover(parent1, parent2, width, height);
                } else {
                    child = Select1.Tournament2.call(
                        { optimize: Genetic.Optimize.Maximize }, scored);
                }
                
                newPopulation.push(mutate(child));
            }
            
            population = newPopulation;
        }
    
        // التعبئة النهائية مع أفضل حل
        const finalPacker = new MaxRectsPacker(width, height, 1, {
            smart: true,
            pot: true,
            square: true
        });
        
        // التأكد من عدم وجود تكرار في الحل النهائي
        const uniqueBestSolution = bestSolution.filter((item, index, self) =>
            index === self.findIndex(i => i.id === item.id)
        );
        
        finalPacker.addArray(uniqueBestSolution.map(item => {
            const rect = new Rectangle(item.width, item.height);
            rect.data = item;
            return rect;
        }));
    
        // إعداد النتائج النهائية
        const packedItems = finalPacker.bins[0]?.rects
            .filter(rect => 
                rect.x + rect.width <= width && 
                rect.y + rect.height <= height)
            .map(rect => ({
                id: rect.data.id,
                width: rect.width,
                height: rect.height,
                x: rect.x,
                y: rect.y,
            })) || [];
    
        const packedArea = packedItems.reduce((sum, item) => 
            sum + (item.width * item.height), 0);
        
        const packedIds = new Set(packedItems.map(p => p.id));
        const unpackedItems = packableItems.filter(item => !packedIds.has(item.id));
    
        return {
            materialDimensions: { width, height },
            packedItems,
            unpackedItems,
            utilization: packedArea / (width * height),
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
                await this.orderCodeService.createOrderCode({ order, user })
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
