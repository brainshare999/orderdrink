import { Drink, Topping, CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'all',
    name: '全部飲品',
    enName: 'All Drinks',
    iconName: 'Sparkles',
    description: '店長嚴選全系列飲品，每日新鮮現萃現煮'
  },
  {
    id: 'tea',
    name: '茶類',
    enName: 'Tea & Brews',
    iconName: 'Leaf',
    description: '嚴選台灣高山在地原片好茶，甘醇回甘不澀口'
  },
  {
    id: 'milk_tea',
    name: '奶茶',
    enName: 'Milk Tea & Boba',
    iconName: 'Milk',
    description: '純淨鮮乳與香醇茶湯的完美融合，濃郁厚實'
  },
  {
    id: 'coffee',
    name: '咖啡',
    enName: 'Specialty Coffee',
    iconName: 'Coffee',
    description: '莊園級精品咖啡豆，職人現磨萃取'
  },
  {
    id: 'other',
    name: '其他飲品',
    enName: 'Fruit & Specialties',
    iconName: 'Citrus',
    description: '鮮果特調、消暑冰沙與無咖啡因天然草本'
  }
];

export const AVAILABLE_TOPPINGS: Topping[] = [
  { id: 'top-boba', name: '慢熬黑糖波霸珍珠', price: 10 },
  { id: 'top-coconut', name: '高纖椰果', price: 10 },
  { id: 'top-grass-jelly', name: '手工嫩仙草凍', price: 10 },
  { id: 'top-crystal', name: '寒天晶球 (低卡)', price: 15 },
  { id: 'top-pudding', name: '香濃手作布丁', price: 15 },
  { id: 'top-cheese-foam', name: '法式厚芝士海鹽奶蓋', price: 20 },
  { id: 'top-aloe', name: '天然庫拉索蘆薈粒', price: 15 }
];

export const DEFAULT_DRINKS: Drink[] = [
  // --- 茶類 (Tea) ---
  {
    id: 'drink-tea-1',
    name: '阿里山四季春茶',
    englishName: 'Alishan Four Seasons Oolong',
    category: 'tea',
    price: 40,
    ingredients: '台灣阿里山四季春高山茶原葉、純淨冷萃過濾水',
    description: '茶湯金黃透亮，帶有天然優雅的白花清香，入口甘甜順口，尾韻清冽持久。',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['招牌推薦', '回甘首選'],
    calories: 0,
    recommendedSweetness: '微糖 (3分)',
    recommendedIce: '微冰'
  },
  {
    id: 'drink-tea-2',
    name: '日月潭紅玉紅茶 (台茶18號)',
    englishName: 'Sun Moon Lake Ruby Black Tea',
    category: 'tea',
    price: 50,
    ingredients: '南投魚池鄉紅玉紅茶原葉 (台茶18號)、純水',
    description: '具有天然肉桂與薄荷芳香，茶湯艷紅明亮，口感溫潤醇厚，無苦澀感。',
    imageUrl: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['台灣名茶', '人氣熱賣'],
    calories: 0,
    recommendedSweetness: '無糖 (0分)',
    recommendedIce: '微冰'
  },
  {
    id: 'drink-tea-3',
    name: '茉莉翡翠綠茶',
    englishName: 'Jasmine Jade Green Tea',
    category: 'tea',
    price: 40,
    ingredients: '經新鮮茉莉花七次窨製綠茶葉、冷萃淨水',
    description: '七窨茉莉真花薰製，花香濃郁撲鼻，茶韻清新舒暢，解膩首選。',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['清新解膩'],
    calories: 0,
    recommendedSweetness: '微糖 (3分)',
    recommendedIce: '少冰'
  },
  {
    id: 'drink-tea-4',
    name: '炭焙文山包種烏龍',
    englishName: 'Roasted Pouchong Oolong',
    category: 'tea',
    price: 45,
    ingredients: '坪林炭焙文山包種烏龍茶葉、純淨水',
    description: '經過龍眼木炭慢火細焙，散發沉穩焙火熟果香，喉韻厚實回甘。',
    imageUrl: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['深焙茶韻'],
    calories: 0,
    recommendedSweetness: '無糖 (0分)',
    recommendedIce: '溫熱'
  },

  // --- 奶茶 (Milk Tea) ---
  {
    id: 'drink-milk-1',
    name: '黑糖琥珀波霸鮮奶',
    englishName: 'Brown Sugar Boba Fresh Milk',
    category: 'milk_tea',
    price: 75,
    ingredients: '新竹寶山黑糖手工慢熬、現煮Q彈波霸珍珠、在地牧場鮮乳坊鮮奶 (不加一滴茶與水)',
    description: '杯壁呈現華麗虎紋，熱騰騰的黑糖波霸與冰涼純濃鮮乳交織出奢華香濃的絕妙口感。',
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['人氣No.1', '無咖啡因', '手工現煮'],
    calories: 420,
    recommendedSweetness: '半糖 (5分)',
    recommendedIce: '微冰'
  },
  {
    id: 'drink-milk-2',
    name: '皇家錫蘭厚鮮奶茶',
    englishName: 'Royal Ceylon Milk Tea',
    category: 'milk_tea',
    price: 65,
    ingredients: '特選斯里蘭卡高地錫蘭紅茶、優質在地小農鮮乳、純蔗糖',
    description: '茶味濃郁不苦澀，與鮮乳以黃金比例融合，奶香滑順，茶香悠長。',
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['經典暢銷', '奶香濃郁'],
    calories: 260,
    recommendedSweetness: '微糖 (3分)',
    recommendedIce: '少冰'
  },
  {
    id: 'drink-milk-3',
    name: '靜岡濃抹茶歐蕾',
    englishName: 'Shizuoka Matcha Latte',
    category: 'milk_tea',
    price: 80,
    ingredients: '日本靜岡一番茶一番摘抹茶粉、初鹿牧場鮮乳、特調甘蔗糖漿',
    description: '石臼研磨抹茶細粉現刷調製，翠綠色澤與微苦茶感，伴隨濃郁奶香，極具日式風情。',
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['日本直送抹茶', '網美打卡'],
    calories: 230,
    recommendedSweetness: '半糖 (5分)',
    recommendedIce: '微冰'
  },
  {
    id: 'drink-milk-4',
    name: '厚芝士海鹽紅玉奶蓋',
    englishName: 'Cheese Foam Ruby Black Tea',
    category: 'milk_tea',
    price: 70,
    ingredients: '日月潭紅玉紅茶底、紐西蘭安佳奶油乳酪、鮮奶油、玫瑰海鹽',
    description: '綿密厚實的鹹甜芝士奶蓋，搭配清爽芬芳的紅玉紅茶，層次豐富驚豔。',
    imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['雙重口感', '芝士控必點'],
    calories: 310,
    recommendedSweetness: '微糖 (3分)',
    recommendedIce: '微冰'
  },

  // --- 咖啡 (Coffee) ---
  {
    id: 'drink-coffee-1',
    name: '衣索比亞耶加雪菲冷萃黑咖啡',
    englishName: 'Yirgacheffe Cold Brew Coffee',
    category: 'coffee',
    price: 75,
    ingredients: '衣索比亞耶加雪菲G1水洗單品咖啡豆、18小時低溫慢速冷萃水',
    description: '帶有顯著的柑橘花香與白桃酸甜感，低苦低澀，口感純淨乾淨，消暑醒腦。',
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['精品單品', '低溫冷萃'],
    calories: 5,
    recommendedSweetness: '無糖 (0分)',
    recommendedIce: '微冰'
  },
  {
    id: 'drink-coffee-2',
    name: '經典義式原味拿鐵',
    englishName: 'Classic Espresso Caffe Latte',
    category: 'coffee',
    price: 80,
    ingredients: '中深烘焙精品義式綜合豆濃縮雙份 (Espresso)、綿密蒸氣鮮乳',
    description: '濃郁堅果可可尾韻的義式濃縮與絲滑奶泡完美結合，甘醇溫順。',
    imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['上班族最愛', '雙倍濃縮'],
    calories: 190,
    recommendedSweetness: '無糖 (0分)',
    recommendedIce: '少冰'
  },
  {
    id: 'drink-coffee-3',
    name: '西西里檸檬氣泡冰咖啡',
    englishName: 'Sicilian Sparkling Lemon Coffee',
    category: 'coffee',
    price: 85,
    ingredients: '現萃義式濃縮咖啡、屏東九如新鮮檸檬汁、細緻氣泡水、天然蔗糖液',
    description: '檸檬的酸香明亮與綿密氣泡，撞擊深焙咖啡香氣，夏日極致清爽解暑！',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['夏日限定', '氣泡特調'],
    calories: 110,
    recommendedSweetness: '微糖 (3分)',
    recommendedIce: '正常冰'
  },
  {
    id: 'drink-coffee-4',
    name: '海鹽焦糖風味瑪奇朵',
    englishName: 'Sea Salt Caramel Macchiato',
    category: 'coffee',
    price: 90,
    ingredients: '濃縮咖啡、新鮮鮮乳、法國法芙娜香草糖漿、手工慢煮焦糖醬、法國鹽之花',
    description: '香草奶香襯底，淋上濃縮咖啡與微鹹焦糖醬，甜而不膩，層次迷人。',
    imageUrl: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['甜蜜奢華'],
    calories: 320,
    recommendedSweetness: '半糖 (5分)',
    recommendedIce: '少冰'
  },

  // --- 其他飲品 (Other) ---
  {
    id: 'drink-other-1',
    name: '滿杯香橙翡翠鮮果茶',
    englishName: 'Fresh Orange Jade Green Tea',
    category: 'other',
    price: 70,
    ingredients: '古坑現榨柳橙原汁、茉莉翡翠綠茶、新鮮柳橙切片、話梅一顆',
    description: '滿滿一整杯大份量新鮮柳橙汁，酸甜多汁，搭配茉莉綠茶底，果香滿溢。',
    imageUrl: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['真果汁現榨', '維他命C滿分'],
    calories: 160,
    recommendedSweetness: '微糖 (3分)',
    recommendedIce: '少冰'
  },
  {
    id: 'drink-other-3',
    name: '古早味冬瓜檸檬小紫蘇',
    englishName: 'Traditional Winter Melon Lemon Basil Seeds',
    category: 'other',
    price: 55,
    ingredients: '台南手工老牌冬瓜磚慢熬冬瓜露、屏東新鮮現壓檸檬原汁、高纖羅勒小紫蘇籽',
    description: '冬瓜甜香中和鮮檸酸爽，加入豐富膳食纖維的小紫蘇，咕溜有嚼勁又清涼。',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['無咖啡因', '飽足低負擔'],
    calories: 140,
    recommendedSweetness: '固定甜度 (冬瓜甜)',
    recommendedIce: '少冰'
  },
  {
    id: 'drink-other-4',
    name: '蜂蜜柚子白玉氣泡飲',
    englishName: 'Honey Yuzu White Pearl Sparkling',
    category: 'other',
    price: 65,
    ingredients: '韓國黃金柚子果醬、純天然龍眼蜂蜜、冰鎮強氣泡水、寒天白玉晶球',
    description: '柚皮香氣與純蜜清甜在氣泡中雀躍綻放，搭配低卡晶球，爽口微醺感。',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['無咖啡因', '清爽氣泡'],
    calories: 130,
    recommendedSweetness: '微糖 (3分)',
    recommendedIce: '正常冰'
  },
  {
    id: 'drink-other-5',
    name: '金桔檸檬蜂蜜氣泡飲',
    englishName: 'Kumquat Lemon Honey Sparkling',
    category: 'other',
    price: 65,
    ingredients: '新鮮金桔汁、屏東九如檸檬原汁、龍眼純蜂蜜、強氣泡水',
    description: '黃金比例的金桔檸檬酸甜滋味，結合啵棒氣泡口感，解膩又消暑。',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['消暑解膩', '氣泡特調'],
    calories: 130,
    recommendedSweetness: '微糖 (3分)',
    recommendedIce: '正常冰'
  },
  // 冰沙類置於最後
  {
    id: 'drink-other-2',
    name: '大湖草莓芝芝雪酪冰沙',
    englishName: 'Fresh Strawberry Cheese Sorbet',
    category: 'other',
    price: 95,
    ingredients: '苗栗大湖新鮮急凍草莓、綠茶冰沙、手作厚芝士奶蓋、寒天晶球',
    description: '鮮甜草莓打製綿密粉紅冰沙，底層寒天Q彈，頂層厚芝士奶蓋鹹香濃郁。',
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['季節新品', '冰沙特調'],
    calories: 290,
    recommendedSweetness: '半糖 (5分)',
    recommendedIce: '正常冰'
  },
  {
    id: 'drink-other-6',
    name: '紐西蘭鮮綠奇異果冰沙',
    englishName: 'New Zealand Green Kiwi Smoothie',
    category: 'other',
    price: 85,
    ingredients: '紐西蘭進口新鮮綠奇異果、檸檬汁、純淨蜂蜜、碎冰雪酪',
    description: '豐富維生素C與膳食纖維，酸甜清爽、沁涼綿密的夏日冰沙首選。',
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    tags: ['季節限定', '冰沙特調'],
    calories: 210,
    recommendedSweetness: '半糖 (5分)',
    recommendedIce: '正常冰'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ord-1001',
    orderNumber: 'SIP-8821',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    items: [
      {
        cartItemId: 'item-1',
        drinkId: 'drink-milk-1',
        name: '黑糖琥珀波霸鮮奶',
        imageUrl: 'https://images.unsplash.com/photo-1558857563-b37cf2dd1ceb?auto=format&fit=crop&w=800&q=80',
        category: 'milk_tea',
        basePrice: 75,
        size: '大杯 (L - 700ml)' as const,
        sizePriceDiff: 10,
        ice: '微冰' as const,
        sugar: '微糖 (3分)' as const,
        toppings: [{ id: 'top-boba', name: '慢熬黑糖波霸珍珠', price: 10 }],
        toppingTotal: 10,
        finalUnitPrice: 95,
        quantity: 2,
        subtotal: 190,
        itemNote: '請幫忙分開裝提袋'
      },
      {
        cartItemId: 'item-2',
        drinkId: 'drink-tea-1',
        name: '阿里山四季春茶',
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
        category: 'tea',
        basePrice: 40,
        size: '大杯 (L - 700ml)' as const,
        sizePriceDiff: 10,
        ice: '少冰' as const,
        sugar: '無糖 (0分)' as const,
        toppings: [],
        toppingTotal: 0,
        finalUnitPrice: 50,
        quantity: 1,
        subtotal: 50
      }
    ],
    totalQuantity: 3,
    subtotal: 240,
    deliveryFee: 0,
    discount: 0,
    totalAmount: 240,
    customerInfo: {
      name: '林先生',
      phone: '0912-345-678',
      orderType: 'pickup' as const,
      pickupTime: '15 分鐘後',
      paymentMethod: 'linepay' as const,
      notes: '到店時會出示手機號碼核對'
    },
    status: 'preparing' as const
  },
  {
    id: 'ord-1002',
    orderNumber: 'SIP-8822',
    createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    items: [
      {
        cartItemId: 'item-3',
        drinkId: 'drink-coffee-2',
        name: '經典義式原味拿鐵',
        imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
        category: 'coffee',
        basePrice: 80,
        size: '中杯 (M - 500ml)' as const,
        sizePriceDiff: 0,
        ice: '熱飲' as const,
        sugar: '無糖 (0分)' as const,
        toppings: [],
        toppingTotal: 0,
        finalUnitPrice: 80,
        quantity: 3,
        subtotal: 240
      },
      {
        cartItemId: 'item-4',
        drinkId: 'drink-other-1',
        name: '滿杯香橙翡翠鮮果茶',
        imageUrl: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=800&q=80',
        category: 'other',
        basePrice: 70,
        size: '大杯 (L - 700ml)' as const,
        sizePriceDiff: 10,
        ice: '少冰' as const,
        sugar: '半糖 (5分)' as const,
        toppings: [{ id: 'top-coconut', name: '高纖椰果', price: 10 }],
        toppingTotal: 10,
        finalUnitPrice: 90,
        quantity: 2,
        subtotal: 180
      }
    ],
    totalQuantity: 5,
    subtotal: 420,
    deliveryFee: 30,
    discount: 0,
    totalAmount: 450,
    customerInfo: {
      name: '陳小姐',
      phone: '0988-123-456',
      orderType: 'delivery' as const,
      pickupTime: '盡快送達',
      address: '台北市信義區松仁路100號12樓 (櫃台轉交)',
      paymentMethod: 'credit' as const,
      notes: '請送達前致電'
    },
    status: 'completed' as const
  }
];
