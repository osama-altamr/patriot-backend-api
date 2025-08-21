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
import { DataSource } from 'typeorm'
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
        const width = inputData.width ?? material.width;
        const height = inputData.height ?? material.height;
    
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
        
        console.log(`Offloading job to worker with ${packableItems.length} items.`);
        worker.postMessage({ 
            width, 
            height, 
            packableItems,
            originalMaterialId: inputData.materialId
        })
      }

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
    
    async glassCutting(inputData: GlassCuttingDto): Promise<any> {
        const material = await this.materialService.getMaterial(inputData.materialId);
        const width = inputData.width ?? material.width;
        const height = inputData.height ?? material.height;
    
        console.log(`عملية القطع الأمثل على مادة مقاس ${width}x${height}`);
    
        const allItems = (await this.orderItemRepository.findAll({})).map(item => ({
            id: item.id,
            width: item.width,
            height: item.height,
        }));
        
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
        
        const config = {
            iterations: 7000,
            populationSize: 1000, 
            mutationChance: 0.4,
            crossoverChance: 0.85,
            fittestAlwaysSurvives: true,
            eliteCount: 5
        };
        
        let population: PackableItem[][] = [];
        for (let i = 0; i < config.populationSize; i++) {
            const individual = packableItems.map(item => {
                const shouldRotate = item.height > item.width && 
                                   item.width <= height && 
                                   item.height <= width;
                return shouldRotate 
                    ? { ...item, width: item.height, height: item.width } 
                    : item;
            });
            
            population.push(this.shuffleWithPriority(individual));
        }
    
        const calculateFitness = (chromosome: PackableItem[]) => {
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
    
         glassCuttingData = {
            materialDimensions: { width, height },
            packedItems,
            unpackedItems,
            utilization: packedArea / (width * height),
        };
        return glassCuttingData
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
