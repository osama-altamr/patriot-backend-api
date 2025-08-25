import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemService } from '../services/order-items.service';
import { OrdersRepository } from '../repository/orders.repository';
import { OrderItemRepository } from '../repository/order-item.repository';
import { ProductService } from '../../products/services/product.service';
import { CategoryRepository } from '/categories/repository/category.repository';
import { MaterialRepository } from '/materials/repository/material.repository';
import { PermissionService } from '/permissions/services/permission.service';
import { NotificationRepository } from '/notifications/repository/notification.repository';
import { UserService } from '/users/services/user.service';
import { QrcodeService } from '../services/qrcode.service';
import { StageRepository } from '/stages/repository/stage.repository';
import { OrderItemActionRepository } from '../repository/order-item-action.repository';
import { CreateOrderItemDto } from '../api/dto/create-order.dto';
import { OrderItem } from '../../../database/entities/order-item.entity';
import { Product } from '../../../database/entities/product.entity';
import { Stage } from '../../../database/entities/stage.entity';

describe('OrderItemService - Stages Integration', () => {
    let service: OrderItemService;
    let productService: ProductService;
    let orderItemRepository: OrderItemRepository;

    const mockProduct: Product = {
        id: 'product-1',
        name: { en: 'Test Product', ar: 'منتج تجريبي' },
        stages: [
            {
                id: 'stage-1',
                name: { en: 'Stage 1', ar: 'المرحلة الأولى' },
                order: 1
            } as Stage,
            {
                id: 'stage-2', 
                name: { en: 'Stage 2', ar: 'المرحلة الثانية' },
                order: 2
            } as Stage,
            {
                id: 'stage-3',
                name: { en: 'Stage 3', ar: 'المرحلة الثالثة' },
                order: 3
            } as Stage
        ]
    } as Product;

    const mockOrderItemRepository = {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findOneBy: jest.fn(),
        findOneByIdWithPop: jest.fn(),
    };

    const mockProductService = {
        getProduct: jest.fn().mockResolvedValue(mockProduct),
    };

    const mockOrdersRepository = {
        findOneById: jest.fn().mockResolvedValue({ id: 'order-1' }),
    };

    const mockQrcodeService = {
        generateQRCode: jest.fn().mockResolvedValue('mock-qr-code'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderItemService,
                { provide: OrdersRepository, useValue: mockOrdersRepository },
                { provide: OrderItemRepository, useValue: mockOrderItemRepository },
                { provide: ProductService, useValue: mockProductService },
                { provide: CategoryRepository, useValue: {} },
                { provide: MaterialRepository, useValue: {} },
                { provide: PermissionService, useValue: {} },
                { provide: NotificationRepository, useValue: {} },
                { provide: UserService, useValue: {} },
                { provide: QrcodeService, useValue: mockQrcodeService },
                { provide: StageRepository, useValue: {} },
                { provide: OrderItemActionRepository, useValue: {} },
            ],
        }).compile();

        service = module.get<OrderItemService>(OrderItemService);
        productService = module.get<ProductService>(ProductService);
        orderItemRepository = module.get<OrderItemRepository>(OrderItemRepository);
    });

    describe('createOrderItem with stages', () => {
        it('should create order item with all stages from product', async () => {
            const orderItemData: CreateOrderItemDto = {
                width: 100,
                height: 200,
                productId: 'product-1',
                currentStage: mockProduct.stages[0], // First stage should be current
            };

            const expectedOrderItem: OrderItem = {
                id: 'order-item-1',
                width: 100,
                height: 200,
                stages: mockProduct.stages,
                currentStage: mockProduct.stages[0], // First stage should be current
            } as OrderItem;

            mockOrderItemRepository.create.mockResolvedValue(expectedOrderItem);
            mockOrderItemRepository.update.mockResolvedValue({
                ...expectedOrderItem,
                qrCode: 'mock-qr-code',
            });

            const result = await service.createOrderItem('order-1', orderItemData);

            // Verify that create was called with stages from product
            expect(mockOrderItemRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    stages: mockProduct.stages,
                    currentStage: mockProduct.stages[0],
                })
            );

            // Verify that the result contains the stages
            expect(result.qrCode).toBe('mock-qr-code');
        });

        it('should set first stage as current stage when product has stages', async () => {
            const orderItemData: CreateOrderItemDto = {
                width: 100,
                height: 200,
                productId: 'product-1',
                currentStage: mockProduct.stages[0],
            };

            mockOrderItemRepository.create.mockResolvedValue({
                id: 'order-item-1',
                stages: mockProduct.stages,
                currentStage: mockProduct.stages[0],
            } as OrderItem);

            mockOrderItemRepository.update.mockResolvedValue({
                id: 'order-item-1',
                stages: mockProduct.stages,
                currentStage: mockProduct.stages[0],
                qrCode: 'mock-qr-code',
            } as OrderItem);

            await service.createOrderItem('order-1', orderItemData);

            expect(mockOrderItemRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    currentStage: mockProduct.stages[0], // Should be the first stage (order: 1)
                })
            );
        });
    });
});
