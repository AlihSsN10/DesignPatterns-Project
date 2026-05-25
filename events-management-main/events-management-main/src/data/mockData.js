import { faker } from '@faker-js/faker';

// توليد التصنيفات الأساسية لـ Category Class
export const initialCategories = [
  { id: 'cat-1', name: 'مؤتمرات تقنية', description: 'كل ما يخص التكنولوجيا والبرمجة' },
  { id: 'cat-2', name: 'ورش عمل ورسم', description: 'فعاليات فنية وتطوير مهارات' },
  { id: 'cat-3', name: 'حفلات ومهرجانات', description: 'عروض حية وموسيقى ترفيهية' },
  { id: 'cat-4', name: 'ندوات ثقافية', description: 'جلسات حوارية ومناقشات كتب' }
];

// توليد حسابات مستخدمين افتراضية للتجربة (User Class)
export const initialUsers = [
  {
    id: 'user-organizer',
    name: 'أحمد المنظم',
    email: 'org@events.com',
    password: 'password123',
    role: 'ORGANIZER' // ADMIN, ORGANIZER, ATTENDEE
  },
  {
    id: 'user-attendee',
    name: 'سارة الحاضرة',
    email: 'user@events.com',
    password: 'password123',
    role: 'ATTENDEE'
  }
];

// توليد فعاليات وهمية (Event Class) مرتبطة بالتصنيفات
export const generateMockEvents = () => {
  const events = [];
  for (let i = 1; i <= 8; i++) {
    const category = initialCategories[Math.floor(Math.random() * initialCategories.length)];
    events.push({
      id: `event-${i}`,
      title: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(3),
      dateTime: faker.date.future().toISOString(),
      location: `${faker.location.city()} - ${faker.location.streetAddress()}`,
      capacity: faker.number.int({ min: 50, max: 200 }),
      price: faker.number.int({ min: 0, max: 500 }), // 0 تعني مجاني
      image: `https://images.unsplash.com/photo-${1500000000000 + i * 10000}?w=800&auto=format&fit=crop&q=60`,
      categoryId: category.id,
      organizerId: 'user-organizer'
    });
  }
  return events;
};
