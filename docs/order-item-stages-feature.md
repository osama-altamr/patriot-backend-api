# Order Item Stages Feature

## Overview
تم تطوير ميزة جديدة تضمن أن كل `OrderItem` يحتوي على نفس الـ `stages` التي يحتويها الـ `Product` المرتبط به.

## Changes Made

### 1. Database Schema Changes

#### OrderItem Entity Updates
- أضيفت علاقة `ManyToMany` بين `OrderItem` و `Stage`
- تم إنشاء جدول junction جديد `order_item_stages`
- تم تحديث `IOrderItem` interface لتشمل `stages` و `currentStage`

```typescript
@ManyToMany(() => Stage)
@JoinTable({
    name: 'order_item_stages',
    joinColumn: { name: 'order_item_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'stage_id', referencedColumnName: 'id' }
})
stages: Stage[]
```

#### Migration
- تم إنشاء migration جديد: `1746275700000-add-order-item-stages-relation.ts`
- ينشئ جدول `order_item_stages` مع foreign keys و indices مناسبة

### 2. Service Layer Changes

#### OrderItemService.createOrderItem()
تم تحديث method إنشاء `OrderItem` لتشمل:

```typescript
// إنشاء عنصر الطلب
const orderItem = await this.orderItemRepository.create({
    width: orderItemData.width,
    height: orderItemData.height,
    note: orderItemData.note,
    order: { id: orderId } as any,
    product,
    status: OrderItemStatus.pending,
    price: 0,
    category,
    material,
    currentStage,
    stages: product.stages || [], // نسخ جميع المراحل من المنتج
} as any) as OrderItem
```

### 3. Repository Layer Changes

#### OrderItemRepository
- تم تحديث `findOneBy` و `findOneByIdWithPop` لتشمل `stages` في الـ relations
- تضمن استرجاع جميع المراحل مع `OrderItem`

#### OrdersRepository
- تم تحديث `findOneById` لتشمل `stages` في relations الخاصة بـ `items`

```typescript
relations: {
    user: true,
    driver: true,
    items: {
       product: true,
        category: true,
        currentStage: true,
        stages: true, // إضافة جديدة
    }
}
```

### 4. Logic Flow

1. عند إنشاء `OrderItem` جديد:
   - يتم جلب الـ `Product` مع جميع الـ `stages` المرتبطة به
   - يتم نسخ جميع الـ `stages` من الـ `Product` إلى الـ `OrderItem`
   - يتم تعيين أول مرحلة (حسب الترتيب) كـ `currentStage`

2. عند استرجاع `OrderItem`:
   - يتم جلب جميع الـ `stages` المرتبطة بالـ `OrderItem`
   - يتم جلب الـ `currentStage` الحالية

### 5. Benefits

- **Data Consistency**: كل `OrderItem` يحتوي على نسخة من مراحل المنتج وقت الإنشاء
- **Historical Tracking**: حتى لو تم تغيير مراحل المنتج لاحقاً، تبقى مراحل الـ `OrderItem` كما هي
- **Workflow Management**: يمكن تتبع تقدم كل `OrderItem` عبر مراحله المحددة
- **Flexibility**: يمكن تخصيص مراحل مختلفة لـ `OrderItems` مختلفة حسب الحاجة

### 6. Testing

تم إنشاء اختبارات للتأكد من:
- نسخ الـ `stages` من الـ `Product` إلى الـ `OrderItem`
- تعيين أول مرحلة كـ `currentStage`
- استرجاع الـ `stages` مع الـ `OrderItem`

### 7. Migration Instructions

لتطبيق هذه التغييرات:

1. تشغيل الـ migration:
```bash
npm run typeorm:run
```

2. التأكد من أن جميع الـ `Products` لها `stages` محددة
3. اختبار إنشاء `OrderItems` جديدة للتأكد من نسخ الـ `stages`

### 8. API Response Changes

الآن عند استرجاع `OrderItem`، ستحتوي الاستجابة على:

```json
{
  "id": "order-item-id",
  "width": 100,
  "height": 200,
  "currentStage": {
    "id": "stage-1",
    "name": {"en": "Stage 1", "ar": "المرحلة الأولى"},
    "order": 1
  },
  "stages": [
    {
      "id": "stage-1", 
      "name": {"en": "Stage 1", "ar": "المرحلة الأولى"},
      "order": 1
    },
    {
      "id": "stage-2",
      "name": {"en": "Stage 2", "ar": "المرحلة الثانية"}, 
      "order": 2
    }
  ]
}
```

## Notes

- هذا التغيير يؤثر فقط على `OrderItems` الجديدة
- `OrderItems` الموجودة مسبقاً ستحتاج إلى script منفصل لتحديث الـ `stages` إذا لزم الأمر
- تأكد من تشغيل الـ migration قبل استخدام الميزة الجديدة
